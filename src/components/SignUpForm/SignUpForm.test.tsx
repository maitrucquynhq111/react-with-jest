import { render, screen } from "@testing-library/react";
import { SignUpForm } from "~/components/SignUpForm/SignUpForm";
import userEvent from "@testing-library/user-event";

describe("<SignUpForm />", () => {
  it("Should render and submit form with default values", async () => {
    render(
      <SignUpForm
        onSubmit={jest.fn()}
        defaultValues={{ email: "test@example.com", password: "password" }}
      />,
    );
    // Kiểm tra default values có được hiển thị trên form không
    expect(screen.getByPlaceholderText(/enter email/i)).toHaveValue(
      "test@example.com",
    );
    expect(screen.getByPlaceholderText(/enter password/i)).toHaveValue(
      "password",
    );
  });

  it("Should shoe error message if fields are empty", async () => {
    const mockOnSubmit = jest.fn();
    render(
      <SignUpForm
        onSubmit={mockOnSubmit}
        defaultValues={{ email: "", password: "" }}
      />,
    );

    // Tìm và nhấn submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Kiểm tra error message có hiển thị không
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    // Kiểm tra mockOnSubmit function không được gọi vì lỗi validation
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  it("Should shoe error message if email is not valid", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);

    // Tìm và gõ email không hợp lệ
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, "test@.com");

    // Tìm và gõ password hợp lệ
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    await userEvent.type(passwordInput, "1223password");

    // Nhấn submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Kiểm tra error message có hiển thị không
    expect(screen.getByText(/email is not valid/i)).toBeInTheDocument();
    // Kiểm tra mockOnSubmit function không được gọi vì lỗi validation
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
  it("Should shoe error message if password is not valid", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);

    // Tìm và gõ email hợp lệ
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, "test@example.com");

    // Tìm và gõ password không hợp lệ
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    await userEvent.type(passwordInput, "123");

    // Nhấn submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Kiểm tra error message có hiển thị không
    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument();
    // Kiểm tra mockOnSubmit function không được gọi vì lỗi validation
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("Should submit form and reset form with valid values", async () => {
    const mockOnSubmit = jest.fn();
    render(<SignUpForm onSubmit={mockOnSubmit} />);

    // Tìm và gõ email hợp lệ
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, "test@example.com");

    // Tìm và gõ password hợp lệ
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    await userEvent.type(passwordInput, "1223password");

    // Nhấn submit button
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Kiểm tra mockOnSubmit function đã được gọi với giá trị đúng
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "1223password",
    });

    // Kiểm tra form đã được reset
    expect(emailInput).toHaveValue("");
    expect(passwordInput).toHaveValue("");
  });
});
