import { useContext } from 'react'
import { I18nContext } from '../components/I18n/context'

function useI18n() {
  const i18n = useContext<{
    activeLocale: string
  }>(I18nContext)
  return i18n
}

export default useI18n
