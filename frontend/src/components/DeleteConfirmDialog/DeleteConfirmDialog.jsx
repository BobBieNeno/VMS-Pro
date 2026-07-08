import { useState } from 'react';
import './DeleteConfirmDialog.css';

export default function DeleteConfirmDialog({ isOpen, vehicle, onCancel, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !vehicle) return null;

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onCancel}>
      <div
        className="delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-dialog__icon" aria-hidden="true">
          ⚠️
        </div>
        <h2 id="delete-dialog-title" className="delete-dialog__title">
          ยืนยันการลบข้อมูล
        </h2>
        <p className="delete-dialog__message">
          คุณต้องการลบข้อมูลรถยนต์ทะเบียน <strong>{vehicle.licensePlate}</strong> ใช่หรือไม่?
          <br />
          การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>

        <div className="delete-dialog__actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isDeleting}>
            ยกเลิก
          </button>
          <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
          </button>
        </div>
      </div>
    </div>
  );
}
