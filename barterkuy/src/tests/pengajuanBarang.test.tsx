import { render, screen } from "@testing-library/react";
import GiveThingsForm from "../pages/pengajuan/pengajuanForm";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import store from "../redux/store";

describe("GiveThingsForm Component", () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  global.ResizeObserver = ResizeObserver;

  const mockKategori = [
    { kategori_id: 1, kategori: "Elektronik" },
    { kategori_id: 2, kategori: "Furniture" },
  ];

  const renderWithProvider = (ui: JSX.Element) => {
    return render(<Provider store={store}>{ui}</Provider>);
  };

  it("renders the form fields correctly", () => {
    renderWithProvider(<GiveThingsForm kategori={mockKategori} loadingData={false} errorData={false} />);

    expect(screen.getByPlaceholderText("Nama barang")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Deskripsi barang")).toBeInTheDocument();
    expect(screen.getByText("Pilih kategori barang")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Lokasi barang")).toBeInTheDocument();
    expect(screen.getByLabelText("Gunakan lokasi login anda")).toBeInTheDocument();
    expect(screen.getByText("Pilih jenis penawaran")).toBeInTheDocument();
    expect(screen.getByText("Ajukan Barang")).toBeInTheDocument();
  });

  it("shows loading message when data is loading", () => {
    renderWithProvider(<GiveThingsForm kategori={[]} loadingData={true} errorData={false} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error message when data fetching fails", () => {
    renderWithProvider(<GiveThingsForm kategori={[]} loadingData={false} errorData={true} />);
    expect(screen.getByText("Data Error")).toBeInTheDocument();
  });
});
