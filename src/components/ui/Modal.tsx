import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function Modal({ open, onClose, title, eyebrow, children, wide = false }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode; wide?: boolean }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`modal-panel ${wide ? "modal-panel--wide" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <header className="modal-header">
          <div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2 id="modal-title">{title}</h2></div>
          <button ref={closeButton} className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </header>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}
