import { useEffect } from 'react';
import './Toast.css';

const ICONS = { success: '✓', error: '✕' };

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = setTimeout(() => onDismiss(), 3500);
    return () => clearTimeout(timeoutId);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">
        {ICONS[toast.type] || ICONS.success}
      </span>
      <span className="toast__message">{toast.message}</span>
      <button type="button" className="toast__close" onClick={onDismiss} aria-label="ปิดการแจ้งเตือน">
        ✕
      </button>
    </div>
  );
}
