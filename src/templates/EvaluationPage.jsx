import { TypeSelector } from '../molecules/TypeSelector'
import { ParameterList } from '../organisms/ParameterList'
import { ScoreSummary } from '../molecules/ScoreSummary'
import { useEvaluation } from '../hooks/useEvaluation'
import { useUrlSync } from '../hooks/useUrlSync'

export function EvaluationPage({ onHome }) {
  const evalState = useEvaluation()
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
          <button class="btn-home" onClick={onHome} title="Home">&#8592;</button>
          <h1 class="title">
            <span class="title-highlight">UPE</span>
            <span class="title-sub">Universal Parametric Evaluator</span>
          </h1>
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
