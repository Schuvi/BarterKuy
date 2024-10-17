import { render, fireEvent, waitFor } from '@testing-library/react';
import GiveThingsUpImg from '../pages/pengajuan/pengajuanUploadImg';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/redux/userSlice';
import Swal from 'sweetalert2';
import { vi } from 'vitest';

// Mock Swal
vi.mock('sweetalert2', () => ({
    fire: vi.fn(), // Mock `fire` sebagai `vi.fn()`
}));

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

describe('GiveThingsUpImg Component', () => {
    afterEach(() => {
        Swal.fire.mockClear(); // Bersihkan mock sebelum setiap tes
    });

  test('should display success alert when upload is successful', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <GiveThingsUpImg />
      </Provider>
    );

    // Mock the onSuccess function by triggering file input change
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.createElement('input');
    input.type = 'file';
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    // Simulate a successful upload response
    const successResponse = {
      name: 'test.png',
      filePath: 'path/to/test.png',
      fileId: '123',
    };
    fireEvent.click(getByText('+')); // Simulate clicking the button to trigger upload
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Berhasil',
        text: 'Berhasil mengunggah gambar',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    });
  });

  test('should display error alert when upload fails', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <GiveThingsUpImg />
      </Provider>
    );

    // Mock the onError function
    const error = 'Some upload error';
    fireEvent.click(getByText('+')); // Simulate clicking the button to trigger upload

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Gagal mengunggah gambar',
        text: `Upload error ${error}`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    });
  });
});
