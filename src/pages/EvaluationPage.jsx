import { TypeSelector } from '../molecules/TypeSelector'
import { ParameterList } from '../organisms/ParameterList'
import { ScoreSummary } from '../molecules/ScoreSummary'
import { LangSwitcher } from '../molecules/LangSwitcher'
import { useEvaluation } from '../hooks/useEvaluation'
import { useUrlSync } from '../hooks/useUrlSync'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

export function EvaluationPage({ onHome }) {
  const { t, translateParam, locale } = useI18n()
  const { type, setType, name, setName, author, setAuthor, sharedAuthor, showByField, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll, resetCurrent, clearShared } = useEvaluation({ translateParam })

  useUrlSync({
    type, name, author,
    values, excluded, params,
  })

  const handleReset = useCallback(() => {
    sharedAuthor ? clearShared() : resetCurrent()
  }, [sharedAuthor, clearShared, resetCurrent])
  const nameInputRef = useRef(null)

  const [thumbUrl, setThumbUrl] = useState(null)

  useEffect(() => {
    setThumbUrl(null)
    const n = name?.trim()
    if (!n) return
    const controller = new AbortController()
    const raw = n.replace(/\s+/g, '_')
    const fetchThumb = (lang) =>
      fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(raw)}`, { signal: controller.signal })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    ;(async () => {
      const en = await fetchThumb('en')
      if (en?.thumbnail?.source) { setThumbUrl(en.thumbnail.source); return }
      if (locale !== 'en') {
        const loc = await fetchThumb(locale)
        if (loc?.thumbnail?.source) setThumbUrl(loc.thumbnail.source)
      }
    })()
    return () => controller.abort()
  }, [name, locale])

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [type])

  return (
    <div class="evaluation-page flex-col">
      <div class="sticky-header">
        <div class="header-top">
          <button class="btn-home" onClick={onHome} title={t('Home')}>&#8592;</button>
          <h1 class="title">
            <span class="title-highlight"><Trans>UPE</Trans></span>
            <span class="title-sub"><Trans>Universal Parametric Evaluator</Trans> <small>v0.3b</small></span>
          </h1>
          <LangSwitcher />
        </div>
        <TypeSelector value={type} onChange={setType} />
        <ScoreSummary totalScore={totalScore} name={name} setName={setName} author={author} setAuthor={setAuthor} sharedAuthor={sharedAuthor} showByField={showByField} onReset={handleReset} nameInputRef={nameInputRef} type={type} params={params} values={values} excluded={excluded} thumbUrl={thumbUrl} />
      </div>

      <div class="scrollable-content">
        <ParameterList
          params={params}
          values={values}
          onChange={setParamValue}
          excluded={excluded}
          onToggleExcluded={toggleExcluded}
        />
      </div>
    </div>
  )
}
