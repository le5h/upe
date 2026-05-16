import { TypeSelector } from '../molecules/TypeSelector'
import { ParameterList } from '../organisms/ParameterList'
import { ScoreSummary } from '../molecules/ScoreSummary'
import { LangSwitcher } from '../molecules/LangSwitcher'
import { useEvaluation } from '../hooks/useEvaluation'
import { useUrlSync } from '../hooks/useUrlSync'
import { useI18n } from '../i18n/context'
import { Trans } from '../i18n/Trans'

export function EvaluationPage({ onHome }) {
  const { t, translateParam } = useI18n()
  const evalState = useEvaluation({ translateParam })
  useUrlSync({
    type: evalState.type,
    name: evalState.name,
    values: evalState.values,
    excluded: evalState.excluded,
    params: evalState.params,
  })

  const { type, setType, name, setName, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll } = evalState

  return (
    <div class="evaluation-page">
      <div class="sticky-header">
        <div class="header-top">
          <button class="btn-home" onClick={onHome} title={t('Home')}>&#8592;</button>
          <h1 class="title">
            <span class="title-highlight"><Trans>UPE</Trans></span>
            <span class="title-sub"><Trans>Universal Parametric Evaluator</Trans></span>
          </h1>
          <LangSwitcher />
          <TypeSelector value={type} onChange={setType} />
        </div>

        <ScoreSummary totalScore={totalScore} name={name} setName={setName} onReset={resetAll} />
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
