import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VehicleTable from '../src/components/VehicleTable/VehicleTable';

const mockVehicles = [
  { id: '1', licensePlate: '1กก 1234', brand: 'Toyota', model: 'Hilux Revo', note: 'รถกระบะ' },
  { id: '2', licensePlate: '2ขค 5678', brand: 'Honda', model: 'Civic', note: '' },
];

describe('VehicleTable', () => {
  it('renders a row for every vehicle', () => {
    render(<VehicleTable vehicles={mockVehicles} isLoading={false} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('1กก 1234')).toBeInTheDocument();
    expect(screen.getByText('2ขค 5678')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Honda')).toBeInTheDocument();
  });

  it('shows a dash placeholder when note is empty', () => {
    render(<VehicleTable vehicles={mockVehicles} isLoading={false} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders skeleton rows while loading and no data rows', () => {
    const { container } = render(
      <VehicleTable vehicles={[]} isLoading onEdit={() => {}} onDelete={() => {}} />
    );

    expect(container.querySelectorAll('.skeleton-line').length).toBeGreaterThan(0);
    expect(screen.queryByText('1กก 1234')).not.toBeInTheDocument();
  });

  it('calls onEdit with the vehicle when the edit button is clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<VehicleTable vehicles={mockVehicles} isLoading={false} onEdit={onEdit} onDelete={() => {}} />);

    await user.click(screen.getByLabelText('แก้ไข 1กก 1234'));

    expect(onEdit).toHaveBeenCalledWith(mockVehicles[0]);
  });

  it('calls onDelete with the vehicle when the delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<VehicleTable vehicles={mockVehicles} isLoading={false} onEdit={() => {}} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('ลบ 2ขค 5678'));

    expect(onDelete).toHaveBeenCalledWith(mockVehicles[1]);
  });
});
