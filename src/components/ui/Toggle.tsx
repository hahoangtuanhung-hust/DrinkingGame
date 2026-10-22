export function Toggle({ checked, onChange, label, description, disabled = false }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return (
    <label className={`setting-row ${disabled ? "is-disabled" : ""}`}>
      <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <input className="toggle-input" type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-visual" aria-hidden="true"><span /></span>
    </label>
  );
}
