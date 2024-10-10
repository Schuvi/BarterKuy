import { render, screen } from "@testing-library/react";
import { test, expect, describe } from "vitest";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import LoginHeader from "@/pages/auth/login/loginHeader";
import LoginWithEmail from "@/pages/auth/login/loginWithEmail";

describe("Login header test", () => {
  test("Image should be visible", () => {
    render(<LoginHeader />);

    const img = screen.getByRole("img");

    expect(img).toBeInTheDocument();
  });

  test("title should be visible", () => {
    render(<LoginHeader />);

    const title = screen.getByText("Barang Baru, Cara Lama");

    expect(title).toHaveTextContent("Barang Baru, Cara Lama");
  });
});

describe.only("Login form email", () => {
  const renderWithRouter = (child: any) => {
    render(<BrowserRouter>{child}</BrowserRouter>);
  };

  test("or should be render", () => {
    renderWithRouter(<LoginWithEmail />);

    const atau = screen.getByText("Atau");

    expect(atau).toHaveTextContent("Atau");
  });

  test("form should be render correctly", () => {
    renderWithRouter(<LoginWithEmail />);

    const inputEmail = screen.getByLabelText("Email");
    const inputPassword = screen.getByLabelText("Password");
    const checkboxPassword = screen.getByLabelText("Tampilkan Password");
    const buttonSubmit = screen.getByRole("button");

    expect(inputEmail).toBeInTheDocument();
    expect(buttonSubmit).toBeInTheDocument();
    expect(buttonSubmit).toHaveTextContent("Sign In");
    expect(inputPassword).toBeInTheDocument();
    expect(checkboxPassword).toBeInTheDocument();
  });

  test("link register should be render", () => {
    renderWithRouter(<LoginWithEmail />);

    const titleAccount = screen.getByText("Belum memiliki akun?");
    const link = screen.getByText("Daftar disini!");

    expect(titleAccount).toBeInTheDocument();
    expect(link).toBeInTheDocument();
  });

  test("when input empty", async () => {
    renderWithRouter(<LoginWithEmail />);

    const inputEmail = screen.getByLabelText("Email");
    const inputPassword = screen.getByLabelText("Password");

    await userEvent.clear(inputEmail);
    await userEvent.clear(inputPassword);

    expect(inputEmail).toBeInvalid;
    expect(inputPassword).toBeInvalid;
  });

  test("when checkbox checked type password should be change", async () => {
    renderWithRouter(<LoginWithEmail />);

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    const checkbox = screen.getByLabelText("Tampilkan Password");

    expect(inputPassword.type).toBe("password");

    await userEvent.click(checkbox);

    expect(inputPassword.type).toBe("text");
  });
});
