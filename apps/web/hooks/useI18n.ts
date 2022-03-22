import { useContext } from 'react'
import { I18nContext } from '../components/I18n/context'
import { Rosetta } from 'rosetta'
import { LngDict } from '../components/I18n/I18n'

function useI18n() {
  const i18n = useContext<Rosetta<LngDict>>(I18nContext)
  return i18n
}

export default useI18n
