import { useEvaluation } from '../hooks/useEvaluation'
import { useUrlSync } from '../hooks/useUrlSync'
import { EvaluationPage } from '../templates/EvaluationPage'

export function Home() {
  const evalState = useEvaluation()
  useUrlSync({
    type: evalState.type,
    name: evalState.name,
    values: evalState.values,
    excluded: evalState.excluded,
    params: evalState.params,
  })

  return <EvaluationPage state={evalState} />
}
