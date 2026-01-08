import { Counter } from "~/components/Counter/Counter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<Counter/>", () => {
  it("Tăng giảm giá trị (Đảm bảo không bị âm)", async () => {
    const user = userEvent.setup();
    render(<Counter />);

    const btnIncrease = screen.getByRole("button", { name: "+" });
    const btnDecrease = screen.getByRole("button", { name: "-" });

    // Tăng giá trị 2 lần
    await user.click(btnIncrease);
    await user.click(btnIncrease);

    // Giảm giá trị 3 lần
    await user.click(btnDecrease);
    await user.click(btnDecrease);
    await user.click(btnDecrease);

    expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  });
});
