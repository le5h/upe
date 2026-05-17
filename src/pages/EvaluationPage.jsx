import { TypeSelector } from '../molecules/TypeSelector'
import { ParameterList } from '../organisms/ParameterList'
import { ScoreSummary } from '../molecules/ScoreSummary'
import { LangSwitcher } from '../molecules/LangSwitcher'
import { useEvaluation } from '../hooks/useEvaluation'
import { useUrlSync } from '../hooks/useUrlSync'
import { useStorageSync } from '../hooks/useStorage'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { remove } from '../hooks/useStorage'

export function EvaluationPage({ onHome }) {
  const { t, translateParam } = useI18n()
  const evalState = useEvaluation({ translateParam })
  const { type, setType, name, setName, author, setAuthor, sharedAuthor, showByField, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll, restore, _skipPersistRef } = evalState

  useUrlSync({
    type, name, author,
    values, excluded, params,
  })

  useStorageSync({
    type, name, author,
    values, excluded, params,
    skipRef: _skipPersistRef,
  })

  const handleReset = useCallback(() => {
    if (name.trim()) remove(type, name)
    resetAll()
  }, [type, name, resetAll])
  const nameInputRef = useRef(null)

  useEffect(() => {
    nameInputRef.current?.focus()
  }, [type])

  return (
    <div class="flex-col">
      <div class="sticky-header">
        <div class="header-top">
          <button class="btn-home" onClick={onHome} title={t('Home')}>&#8592;</button>
          <h1 class="title">
            <span class="title-highlight"><Trans>UPE</Trans></span>
            <span class="title-sub"><Trans>Universal Parametric Evaluator</Trans> <small>v0.2</small></span>
          </h1>
          <LangSwitcher />
        </div>
        <TypeSelector value={type} onChange={setType} />
        <ScoreSummary totalScore={totalScore} name={name} setName={setName} author={author} setAuthor={setAuthor} sharedAuthor={sharedAuthor} showByField={showByField} onReset={handleReset} nameInputRef={nameInputRef} onRestore={restore} type={type} params={params} values={values} excluded={excluded} />
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
