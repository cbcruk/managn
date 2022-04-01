import { useContext } from 'react'
import { Rosetta } from 'rosetta'
import { I18nContext } from '../components/I18n/context'

function useI18n() {
  const i18n = useContext<{
    activeLocale: string
    t: Rosetta<any>['t']
  }>(I18nContext)
  return i18n
}

export default useI18n
