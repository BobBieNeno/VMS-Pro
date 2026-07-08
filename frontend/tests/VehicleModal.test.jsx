import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleModal from '../src/components/VehicleModal/VehicleModal';

describe('VehicleModal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <VehicleModal isOpen={false} vehicle={null} onClose={() => {}} onSubmit={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows "เพิ่มรถยนต์ใหม่" title in add mode with empty fields', () => {
    render(<VehicleModal isOpen vehicle={null} onClose={() => {}} onSubmit={() => {}} />);

    expect(screen.getByText('เพิ่มรถยนต์ใหม่')).toBeInTheDocument();
    expect(screen.getByLabelText(/หมายเลขทะเบียนรถ/)).toHaveValue('');
  });

  it('pre-fills fields and shows "แก้ไขข้อมูลรถยนต์" in edit mode', () => {
    const vehicle = { id: '1', licensePlate: '1กก 1234', brand: 'Toyota', model: 'Hilux Revo', note: 'ทดสอบ' };
    render(<VehicleModal isOpen vehicle={vehicle} onClose={() => {}} onSubmit={() => {}} />);

    expect(screen.getByText('แก้ไขข้อมูลรถยนต์')).toBeInTheDocument();
    expect(screen.getByLabelText(/หมายเลขทะเบียนรถ/)).toHaveValue('1กก 1234');
    expect(screen.getByLabelText(/รุ่นรถ/)).toHaveValue('Hilux Revo');
  });

  it('shows validation errors and does not call onSubmit when required fields are empty', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<VehicleModal isOpen vehicle={null} onClose={() => {}} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'บันทึก' }));

    expect(await screen.findByText('กรุณากรอกหมายเลขทะเบียน')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with form values when valid', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<VehicleModal isOpen vehicle={null} onClose={() => {}} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/หมายเลขทะเบียนรถ/), '1กก 1234');
    await user.selectOptions(screen.getByLabelText(/ยี่ห้อรถยนต์/), 'Toyota');
    await user.type(screen.getByLabelText(/รุ่นรถ/), 'Hilux Revo');
    await user.click(screen.getByRole('button', { name: 'บันทึก' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        licensePlate: '1กก 1234',
        brand: 'Toyota',
        model: 'Hilux Revo',
        note: '',
      })
    );
  });

  it('calls onClose when the cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<VehicleModal isOpen vehicle={null} onClose={onClose} onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'ยกเลิก' }));

    expect(onClose).toHaveBeenCalled();
  });
});
