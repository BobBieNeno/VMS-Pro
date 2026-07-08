import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import VehicleTable from '../components/VehicleTable/VehicleTable';
import VehicleModal from '../components/VehicleModal/VehicleModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog/DeleteConfirmDialog';
import EmptyState from '../components/EmptyState/EmptyState';
import Pagination from '../components/Pagination/Pagination';
import Toast from '../components/Toast/Toast';
import { useVehicles } from '../hooks/useVehicles';
import './VehicleListPage.css';

const PAGE_SIZE = 10;

export default function VehicleListPage() {
  const { vehicles, isLoading, error, search, setSearch, addVehicle, editVehicle, removeVehicle } =
    useVehicles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);

  const totalPages = Math.max(1, Math.ceil(vehicles.length / PAGE_SIZE));
  const pagedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return vehicles.slice(start, start + PAGE_SIZE);
  }, [vehicles, currentPage]);

  function showToast(type, message) {
    setToast({ type, message });
  }

  function openAddModal() {
    setEditingVehicle(null);
    setIsModalOpen(true);
  }

  function openEditModal(vehicle) {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingVehicle(null);
  }

  async function handleSubmit(formValues) {
    if (editingVehicle) {
      await editVehicle(editingVehicle.id, formValues);
      showToast('success', 'บันทึกข้อมูลสำเร็จ');
    } else {
      await addVehicle(formValues);
      showToast('success', 'เพิ่มข้อมูลรถยนต์สำเร็จ');
      setCurrentPage(1);
    }
    closeModal();
  }

  async function handleConfirmDelete() {
    try {
      await removeVehicle(deletingVehicle.id);
      showToast('success', 'ลบข้อมูลสำเร็จ');
      setDeletingVehicle(null);
      // If we deleted the last item on a page beyond page 1, step back a page
      setCurrentPage((prev) => Math.min(prev, Math.max(1, Math.ceil((vehicles.length - 1) / PAGE_SIZE))));
    } catch (err) {
      showToast('error', err.message || 'ลบข้อมูลไม่สำเร็จ');
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-content">
        <Navbar search={search} onSearchChange={setSearch} onAddClick={openAddModal} />

        <main className="page">
          <div className="page__header">
            <div>
              <h1 className="page__title">รถยนต์ทั้งหมด {vehicles.length} คัน</h1>
              <p className="page__subtitle">จัดการและติดตามสถานะยานพาหนะในระบบ</p>
            </div>
          </div>

          {error && (
            <div className="page__error" role="alert">
              เกิดข้อผิดพลาด: {error}
            </div>
          )}

          <section className="card">
            {!isLoading && vehicles.length === 0 ? (
              <EmptyState
                hasSearch={Boolean(search)}
                onAddClick={openAddModal}
                onClearSearch={() => setSearch('')}
              />
            ) : (
              <>
                <VehicleTable
                  vehicles={pagedVehicles}
                  isLoading={isLoading}
                  onEdit={openEditModal}
                  onDelete={setDeletingVehicle}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={vehicles.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </section>
        </main>
      </div>

      <VehicleModal
        isOpen={isModalOpen}
        vehicle={editingVehicle}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(deletingVehicle)}
        vehicle={deletingVehicle}
        onCancel={() => setDeletingVehicle(null)}
        onConfirm={handleConfirmDelete}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
