import { useI18n } from '../i18n/context'

export function NameInput({ value, onChange }) {
  const { t } = useI18n()
  return (
    <input
      type="text"
      value={value}
      onInput={e => onChange(e.currentTarget.value)}
      placeholder={t('Name your subject...')}
      class="score-name"
    />
  )
}
