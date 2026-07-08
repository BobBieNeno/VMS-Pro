import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmDialog from '../src/components/DeleteConfirmDialog/DeleteConfirmDialog';

const vehicle = { id: '1', licensePlate: '1กก 1234' };

describe('DeleteConfirmDialog', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DeleteConfirmDialog isOpen={false} vehicle={vehicle} onCancel={() => {}} onConfirm={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the license plate in the confirmation message', () => {
    render(<DeleteConfirmDialog isOpen vehicle={vehicle} onCancel={() => {}} onConfirm={() => {}} />);
    expect(screen.getByText('1กก 1234')).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<DeleteConfirmDialog isOpen vehicle={vehicle} onCancel={() => {}} onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'ยืนยันการลบ' }));

    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<DeleteConfirmDialog isOpen vehicle={vehicle} onCancel={onCancel} onConfirm={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'ยกเลิก' }));

    expect(onCancel).toHaveBeenCalled();
  });
});
