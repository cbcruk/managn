import { CHOSEONG_LIST } from '@/constants/index'

const HANGUL_BASE = 0xac00
const HANGUL_END = 0xd7a3
const JUNGSEONG_COUNT = 21
const JONGSEONG_COUNT = 28

type GroupByChoseongParams<T, K extends keyof T> = {
  list: T[]
  key: K
  includeEmpty?: boolean
}

export function groupByChoseong<T, K extends keyof T>({
  list,
  key,
  includeEmpty = true,
}: GroupByChoseongParams<T, K>) {
  const isHangul = (char: string) => {
    const code = char.charCodeAt(0)
    return code >= HANGUL_BASE && code <= HANGUL_END
  }

  const getChoseongIndex = (char: string) => {
    if (!isHangul(char)) return -1

    const code = char.charCodeAt(0) - HANGUL_BASE
    return Math.floor(code / (JUNGSEONG_COUNT * JONGSEONG_COUNT))
  }

  const groups = CHOSEONG_LIST.map((char, index) => {
    const items = list
      .filter((item) => {
        const text = String(item[key] ?? '')
        return text.length > 0 && getChoseongIndex(text[0]) === index
      })
      .toSorted((a, b) =>
        String(a[key] ?? '').localeCompare(String(b[key] ?? ''))
      )

    return { char, items }
  })

  const otherItems = list
    .filter((item) => {
      const text = String(item[key] ?? '')
      return text.length > 0 && !isHangul(text[0])
    })
    .toSorted((a, b) =>
      String(a[key] ?? '').localeCompare(String(b[key] ?? ''))
    )

  const allGroups = [...groups, { char: '기타', items: otherItems }]

  return includeEmpty
    ? allGroups
    : allGroups.filter((group) => group.items.length > 0)
}
