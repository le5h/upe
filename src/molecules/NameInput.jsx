export function NameInput({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onInput={e => onChange(e.currentTarget.value)}
      placeholder="Name your subject..."
      class="score-name"
    />
  )
}
