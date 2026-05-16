import { useI18n } from '../i18n/context'

export function NameInput({ value, onChange, inputRef }) {
  const { t } = useI18n()
  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onInput={e => onChange(e.currentTarget.value)}
      placeholder={t('Name your subject...')}
      class="score-name"
    />
  )
}
