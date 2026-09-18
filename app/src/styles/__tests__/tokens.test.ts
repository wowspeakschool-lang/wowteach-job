import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Проверка полноты набора токенов.
 *
 * Ищет не известные светлые цвета из списка, а ЛЮБОЙ слишком светлый цвет
 * среди фоновых токенов тёмной темы. Разница принципиальная: проверка по
 * списку подтверждает только то, что уже учтено, и именно поэтому первая
 * версия тёмных макетов уехала с белыми разделителями и светлыми плашками.
 */

const CSS = readFileSync(resolve(__dirname, '../tokens.css'), 'utf8')

/** Относительная яркость по WCAG. */
function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const channel = (i: number) => {
    const v = parseInt(full.slice(i * 2, i * 2 + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

type Decl = { name: string; value: string }

function declarations(block: string): Decl[] {
  return [...block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => ({
    name: m[1] as string,
    value: (m[2] as string).trim(),
  }))
}

/**
 * Собирает ВСЕ вхождения селектора, а не первое.
 *
 * Изначально здесь стоял indexOf, и это была ошибка: как только появился
 * второй блок тёмной темы (токены клубов), проверка молча продолжила
 * смотреть только на первый, то есть перестала покрывать новые токены.
 */
function blocksAfter(marker: string, closer: string): string[] {
  const out: string[] = []
  let from = 0
  for (;;) {
    const start = CSS.indexOf(marker, from)
    if (start === -1) break
    const end = CSS.indexOf(closer, start)
    out.push(CSS.slice(start, end === -1 ? undefined : end))
    from = start + marker.length
  }
  return out
}

/**
 * Блоки светлой темы — это ВСЕ простые `:root {`, а не «всё до первого
 * @media». Такое определение уже подвело: грейды и клубы объявлены ниже
 * тёмных блоков, и срез до @media их не видел, из-за чего проверка
 * пропускала ровно те токены, ради которых её расширяли.
 *
 * Селекторы `:root[data-theme=…]` и `:root:not(…)` сюда не попадают:
 * маркер требует пробел и фигурную скобку сразу после `:root`.
 */
function lightBlocks(): string[] {
  const b = blocksAfter('\n:root {', '\n}')
  expect(b.length).toBeGreaterThan(0)
  return b
}

/** Блоки ручного выбора тёмной темы. */
function manualDarkBlocks(): string[] {
  const b = blocksAfter(":root[data-theme='dark']", '\n}')
  expect(b.length).toBeGreaterThan(0)
  return b
}

/** Блоки системной тёмной темы (внутри @media). */
function systemDarkBlocks(): string[] {
  const b = blocksAfter('@media (prefers-color-scheme: dark)', '\n  }')
  expect(b.length).toBeGreaterThan(0)
  return b
}

function mergedDecls(blocks: string[]): Map<string, string> {
  const m = new Map<string, string>()
  for (const b of blocks) for (const d of declarations(b)) m.set(d.name, d.value)
  return m
}

/** Токены, которые красят ПОВЕРХНОСТЬ, а не текст и не границу. */
const IS_BACKGROUND =
  /^--(surface|line)-|^--surface$|^--line$|^--(state|club)-[a-z]+-bg$|^--accent-action-bg$/

/**
 * Пары «фон + текст на нём»: их нельзя брать порознь.
 *
 * --accent-action появился в этом списке позже остальных, по следам бага:
 * один токен красил и залитую кнопку, и текст-акцент на светлой поверхности.
 * В тёмной теме его осветлили ради второго применения, и белая надпись на
 * кнопке просела до 4.2:1 — на экране входа и на фильтре возрастов в
 * расписании. Один токен не может делать обе работы.
 */
const PAIR_PREFIXES = ['--state-', '--club-', '--accent-action'] as const

/**
 * Каким текстом набрана пара. От этого зависит порог WCAG: 4.5:1 для
 * обычного текста и 3:1 для крупного полужирного.
 *
 * Статусные плашки и кнопка действия несут обычный текст (14–15px), поэтому
 * порог для них строгий. Раньше он был 3:1 для всех пар — и красная плашка
 * с 4.10:1 проходила проверку, хотя читать её тяжело.
 */
function thresholdFor(base: string): number {
  return base.startsWith('--club-') ? 3 : 4.5
}

function pairBases(names: string[]): Set<string> {
  const bases = new Set<string>()
  for (const n of names) {
    if (!n.endsWith('-bg')) continue
    if (!PAIR_PREFIXES.some((p) => n.startsWith(p))) continue
    bases.add(n.slice(0, -'-bg'.length))
  }
  return bases
}

describe('тёмная тема', () => {
  it('оба способа задать тёмную тему объявляют одно и то же', () => {
    const m = mergedDecls(manualDarkBlocks())
    const s = mergedDecls(systemDarkBlocks())

    expect(m.size).toBeGreaterThan(40)
    // Разный набор означал бы, что ручной выбор и системная настройка
    // дают разный вид.
    expect([...s.keys()].sort()).toEqual([...m.keys()].sort())
    for (const [name, value] of s) expect(m.get(name), name).toBe(value)
  })

  it("системные блоки защищены :not([data-theme='light'])", () => {
    // Без этой защиты явно выбранная светлая тема на устройстве
    // с тёмной системной сломается.
    for (const block of systemDarkBlocks()) {
      expect(block).toContain(":root:not([data-theme='light'])")
    }
  })

  it('НИ ОДИН фоновый токен не остался светлым', () => {
    const tooLight: string[] = []

    for (const [name, value] of mergedDecls([...manualDarkBlocks(), ...systemDarkBlocks()])) {
      if (!IS_BACKGROUND.test(name)) continue
      for (const hex of value.match(/#[0-9a-fA-F]{3,6}\b/g) ?? []) {
        if (luminance(hex) > 0.3) tooLight.push(`${name}: ${hex}`)
      }
    }

    expect(tooLight).toEqual([])
  })
})

describe('парные токены «фон + текст»', () => {
  it('у каждого фона есть свой текст — и в светлой теме, и в тёмной', () => {
    const scopes: Array<[string, string[]]> = [
      ['светлая', [...mergedDecls(lightBlocks()).keys()]],
      ['тёмная (ручная)', [...mergedDecls(manualDarkBlocks()).keys()]],
      ['тёмная (системная)', [...mergedDecls(systemDarkBlocks()).keys()]],
    ]

    for (const [label, names] of scopes) {
      const bases = pairBases(names)
      expect(bases.size, label).toBeGreaterThan(0)
      for (const base of bases) {
        expect(names, `${label}: ${base} без парного текста`).toContain(`${base}-text`)
      }
    }
  })

  it('надпись различима на своём фоне', () => {
    const scopes: Array<[string, Map<string, string>]> = [
      ['светлая', mergedDecls(lightBlocks())],
      ['тёмная (ручная)', mergedDecls(manualDarkBlocks())],
      ['тёмная (системная)', mergedDecls(systemDarkBlocks())],
    ]

    for (const [label, map] of scopes) {
      for (const base of pairBases([...map.keys()])) {
        const bg = map.get(`${base}-bg`)
        const text = map.get(`${base}-text`)
        if (!bg?.startsWith('#') || !text?.startsWith('#')) continue
        const ratio = contrast(bg, text)
        const need = thresholdFor(base)
        expect(
          ratio,
          `${label}: ${base} — ${ratio.toFixed(2)}:1, нужно ${need}:1`,
        ).toBeGreaterThanOrEqual(need)
      }
    }
  })
})

describe('грейды', () => {
  it('не темизуются: объявлены один раз и вне тёмных блоков', () => {
    for (const block of [...manualDarkBlocks(), ...systemDarkBlocks()]) {
      const names = declarations(block).map((n) => n.name)
      expect(names.filter((n) => n.startsWith('--grade-'))).toEqual([])
    }
    expect(CSS).toContain('--grade-pro:')
  })
})

describe('клубы', () => {
  it('шесть типов, включая «прочее» — оно тоже должно быть подписано', () => {
    const light = [...mergedDecls(lightBlocks()).keys()]
    const kinds = light
      .filter((n) => n.startsWith('--club-') && n.endsWith('-bg'))
      .map((n) => n.slice('--club-'.length, -'-bg'.length))
      .sort()
    expect(kinds).toEqual(['gaming', 'master', 'other', 'reading', 'speaking', 'webinar'])
  })

  it('у каждого типа есть цвет линии', () => {
    const light = [...mergedDecls(lightBlocks()).keys()]
    for (const k of ['speaking', 'reading', 'master', 'webinar', 'gaming', 'other']) {
      expect(light).toContain(`--club-${k}-line`)
    }
  })
})
