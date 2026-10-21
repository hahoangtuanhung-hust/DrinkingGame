export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label: string; description?: string }) {
  return (
    <label className="setting-row">
      <span><strong>{label}</strong>{description && <small>{description}</small>}</span>
      <input className="toggle-input" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-visual" aria-hidden="true"><span /></span>
    </label>
  );
}
