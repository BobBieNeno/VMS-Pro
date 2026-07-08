import './VehicleTable.css';

function SkeletonRow() {
  return (
    <tr className="vehicle-table__row vehicle-table__row--skeleton">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-line" />
        </td>
      ))}
    </tr>
  );
}

function getVehicleStatus(vehicle) {
  const text = `${vehicle.note || ''} ${vehicle.brand || ''} ${vehicle.model || ''}`.toLowerCase();
  if (text.includes('ซ่อม') || text.includes('maintenance')) return 'ซ่อมบำรุง';
  return 'พร้อมใช้งาน';
}

export default function VehicleTable({ vehicles, isLoading, onEdit, onDelete }) {
  return (
    <div className="vehicle-table-wrapper">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>หมายเลขทะเบียน</th>
            <th>ยี่ห้อ</th>
            <th>รุ่น</th>
            <th>หมายเหตุ</th>
            <th className="vehicle-table__actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading &&
            vehicles.map((vehicle) => {
              const status = getVehicleStatus(vehicle);

              return (
                <tr key={vehicle.id} className="vehicle-table__row">
                  <td>
                    <div className="vehicle-table__mobile-main">
                      <span className="vehicle-table__mobile-icon" aria-hidden="true">
                        ▣
                      </span>
                      <div>
                        <span className="vehicle-table__plate">{vehicle.licensePlate}</span>
                        <span className="vehicle-table__mobile-model">
                          {vehicle.brand} {vehicle.model}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>
                    <span className="vehicle-table__note" title={vehicle.note || ''}>
                      {vehicle.note ? vehicle.note : <span className="vehicle-table__note--empty">—</span>}
                    </span>
                    <span className={`vehicle-table__status ${status === 'ซ่อมบำรุง' ? 'is-warning' : ''}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="vehicle-table__actions">
                      <button
                        type="button"
                        className="icon-btn icon-btn--edit"
                        onClick={() => onEdit(vehicle)}
                        aria-label={`แก้ไข ${vehicle.licensePlate}`}
                        title="แก้ไข"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--delete"
                        onClick={() => onDelete(vehicle)}
                        aria-label={`ลบ ${vehicle.licensePlate}`}
                        title="ลบ"
                      >
                        ⌫
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
