import './VehicleTable.css';

function SkeletonRow() {
  return (
    <tr className="vehicle-table__row">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-line" />
        </td>
      ))}
    </tr>
  );
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
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading &&
            vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="vehicle-table__row">
                <td>
                  <span className="vehicle-table__plate">{vehicle.licensePlate}</span>
                </td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.model}</td>
                <td>
                  <span className="vehicle-table__note" title={vehicle.note || ''}>
                    {vehicle.note ? vehicle.note : <span className="vehicle-table__note--empty">—</span>}
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
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="icon-btn icon-btn--delete"
                      onClick={() => onDelete(vehicle)}
                      aria-label={`ลบ ${vehicle.licensePlate}`}
                      title="ลบ"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
