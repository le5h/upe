import { TypeSelector } from '../molecules/TypeSelector'
import { ParameterList } from '../organisms/ParameterList'
import { ScoreSummary } from '../molecules/ScoreSummary'

export function EvaluationPage({ state }) {
  const { type, setType, name, setName, params, values, setParamValue, excluded, toggleExcluded, totalScore, resetAll } = state

  return (
    <div class="evaluation-page">
      <div class="sticky-header">
        <div class="header-top">
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
