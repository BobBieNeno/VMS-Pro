import { useEffect, useRef, useState } from "react";
import "./VehicleModal.css";

const COMMON_BRANDS = [
  "Toyota",
  "Honda",
  "Isuzu",
  "Nissan",
  "Mazda",
  "Mitsubishi",
  "Ford",
  "อื่นๆ",
];

const EMPTY_FORM = { licensePlate: "", brand: "", model: "", note: "" };

/**
 * Shared Add / Edit modal. `vehicle` prop being null means "add mode";
 * otherwise the form is pre-filled for editing.
 */
export default function VehicleModal({ isOpen, vehicle, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const brandDropdownRef = useRef(null);

  const isEditMode = Boolean(vehicle);

  useEffect(() => {
    if (isOpen) {
      setForm(
        vehicle
          ? {
              licensePlate: vehicle.licensePlate,
              brand: vehicle.brand,
              model: vehicle.model,
              note: vehicle.note || "",
            }
          : EMPTY_FORM,
      );
      setErrors({});
      setSubmitError("");
      setIsBrandOpen(false);
    }
  }, [isOpen, vehicle]);

  useEffect(() => {
    if (!isBrandOpen) return undefined;

    function handlePointerDown(e) {
      if (!brandDropdownRef.current?.contains(e.target)) {
        setIsBrandOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsBrandOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isBrandOpen]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBrandSelect(brand) {
    handleChange("brand", brand);
    setIsBrandOpen(false);
  }

  function validate() {
    const nextErrors = {};
    if (!form.licensePlate.trim())
      nextErrors.licensePlate = "กรุณากรอกหมายเลขทะเบียน";
    if (!form.brand.trim()) nextErrors.brand = "กรุณาเลือกยี่ห้อรถยนต์";
    if (!form.model.trim()) nextErrors.model = "กรุณากรอกรุ่นรถ";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      if (err.fieldErrors) {
        setErrors(err.fieldErrors);
      } else {
        setSubmitError(
          err.message || "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 id="vehicle-modal-title" className="modal__title">
            {isEditMode ? "แก้ไขข้อมูลรถยนต์" : "เพิ่มรถยนต์ใหม่"}
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="ปิด"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            {submitError && (
              <div className="modal__submit-error">{submitError}</div>
            )}

            <div className="form-field">
              <label htmlFor="licensePlate">
                หมายเลขทะเบียนรถ <span className="form-field__required">*</span>
              </label>
              <input
                id="licensePlate"
                type="text"
                value={form.licensePlate}
                onChange={(e) => handleChange("licensePlate", e.target.value)}
                placeholder="เช่น 1กก 1234"
                className={errors.licensePlate ? "has-error" : ""}
                autoFocus
              />
              {errors.licensePlate && (
                <p className="form-field__error">{errors.licensePlate}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="brand">
                ยี่ห้อรถยนต์ <span className="form-field__required">*</span>
              </label>
              <div className="brand-select" ref={brandDropdownRef}>
                <button
                  id="brand"
                  type="button"
                  className={[
                    "brand-select__trigger",
                    !form.brand ? "is-placeholder" : "",
                    isBrandOpen ? "is-open" : "",
                    errors.brand ? "has-error" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-haspopup="listbox"
                  aria-expanded={isBrandOpen}
                  aria-controls="brand-options"
                  onClick={() => setIsBrandOpen((prev) => !prev)}
                >
                  <span>{form.brand || "เลือกยี่ห้อ"}</span>
                  <span className="brand-select__chevron" aria-hidden="true" />
                </button>

                {isBrandOpen && (
                  <div
                    id="brand-options"
                    className="brand-select__menu"
                    role="listbox"
                  >
                    {COMMON_BRANDS.map((brand) => {
                      const isSelected = form.brand === brand;

                      return (
                        <button
                          key={brand}
                          type="button"
                          className={`brand-select__option${isSelected ? " is-selected" : ""}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleBrandSelect(brand)}
                        >
                          <span>{brand}</span>
                          {isSelected && (
                            <span
                              className="brand-select__check"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.brand && (
                <p className="form-field__error">{errors.brand}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="model">
                รุ่นรถ <span className="form-field__required">*</span>
              </label>
              <input
                id="model"
                type="text"
                value={form.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="ระบุรุ่นรถ"
                className={errors.model ? "has-error" : ""}
              />
              {errors.model && (
                <p className="form-field__error">{errors.model}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="note">หมายเหตุ</label>
              <textarea
                id="note"
                rows={3}
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
              />
              {errors.note && (
                <p className="form-field__error">{errors.note}</p>
              )}
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
