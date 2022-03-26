import { useRouter } from 'next/router'
import useI18n from '../../hooks/useI18n'
import { LOCALES } from '../I18n/constants'
import { Language } from '../Icons'

export function I18nSelect() {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const i18n = useI18n()

  return (
    <label className="relative overflow-hidden inline-flex">
      <Language />

      <select
        className="absolute left-0 opacity-0"
        defaultValue={i18n.activeLocale}
        onChange={(e) => {
          router.push({ pathname, query }, asPath, { locale: e.target.value })
        }}
      >
        {LOCALES.map((locale) => {
          return (
            <option key={locale} value={locale}>
              {locale.toUpperCase()}
            </option>
          )
        })}
      </select>
    </label>
  )
}
