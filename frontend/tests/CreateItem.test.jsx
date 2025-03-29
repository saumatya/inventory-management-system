import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CreateItem from '../src/components/CreateItem'; // Adjust the import path as needed

// Mock axios
vi.mock('axios');

describe('CreateItem Component', () => {
  const mockFetchItems = vi.fn();

  beforeEach(() => {
    render(<CreateItem fetchItems={mockFetchItems} />);
  });

  it('renders the form with all fields', () => {
    expect(screen.getByText('Create Item')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('updates state when form fields are changed', () => {
    const nameInput = screen.getByLabelText('Name');
    const categoryInput = screen.getByLabelText('Category');
    const quantityInput = screen.getByLabelText('Quantity');
    const priceInput = screen.getByLabelText('Price');

    fireEvent.change(nameInput, { target: { value: 'Test Item' } });
    fireEvent.change(categoryInput, { target: { value: 'Test Category' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });
    fireEvent.change(priceInput, { target: { value: '19.99' } });

    expect(nameInput.value).toBe('Test Item');
    expect(categoryInput.value).toBe('Test Category');
    expect(quantityInput.value).toBe('10');
    expect(priceInput.value).toBe('19.99');
  });

  it('submits the form successfully', async () => {
    const mockResponse = { status: 201 };
    axios.post.mockResolvedValue(mockResponse);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '19.99' } });

    // Submit the form
    fireEvent.click(screen.getByText('Add Item'));

    // Check that axios was called with the right data
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/items', {
        name: 'Test Item',
        category: 'Test Category',
        quantity: '10',
        price: '19.99'
      });
    });

    // Check for success message and form reset
    await waitFor(() => {
      expect(screen.getByText('Item added successfully!')).toBeInTheDocument();
      expect(screen.getByLabelText('Name').value).toBe('');
      expect(screen.getByLabelText('Category').value).toBe('');
      expect(screen.getByLabelText('Quantity').value).toBe('');
      expect(screen.getByLabelText('Price').value).toBe('');
      expect(mockFetchItems).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    const mockError = {
      response: {
        data: { error: 'Network Error' }
      }
    };
    axios.post.mockRejectedValue(mockError);

    // Fill out required fields
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test Item' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Price'), { target: { value: '19.99' } });

    // Submit the form
    fireEvent.click(screen.getByText('Add Item'));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error: Network Error/)).toBeInTheDocument();
    });
  });

  it('shows validation errors when required fields are empty', async () => {
    // Submit the form without filling any fields
    fireEvent.click(screen.getByText('Add Item'));

    // All fields should show validation errors
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveAttribute('required');
      expect(screen.getByLabelText('Category')).toHaveAttribute('required');
      expect(screen.getByLabelText('Quantity')).toHaveAttribute('required');
      expect(screen.getByLabelText('Price')).toHaveAttribute('required');
    });

    // Axios should not be called
    expect(axios.post).not.toHaveBeenCalled();
  });
});