import { useRef, useState, useEffect } from 'react'
import rosetta from 'rosetta'
import { I18nContext } from './context'
import ko from '../../locales/ko.json'

export type LngDict = typeof ko

const i18n = rosetta<LngDict>()

i18n.locale('ko')

export default function I18n({ children, locale, lngDict }) {
  const activeLocaleRef = useRef(locale)
  const [, setTick] = useState(0)
  const firstRender = useRef(true)

  const i18nWrapper = {
    activeLocale: activeLocaleRef.current,
    t: i18n.t,
    locale: (l, dict) => {
      i18n.locale(l)

      activeLocaleRef.current = l

      if (dict) {
        i18n.set(l, dict)
      }

      setTick((tick) => tick + 1)
    },
  }

  if (locale && firstRender.current === true) {
    firstRender.current = false
    i18nWrapper.locale(locale, lngDict)
  }

  useEffect(() => {
    if (locale) {
      i18nWrapper.locale(locale, lngDict)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lngDict, locale])

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  )
}
