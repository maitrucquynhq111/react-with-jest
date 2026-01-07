import { Button } from "~/components/Button/Button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<Button />", () => {
  it("Should render and click Button", async () => {
    // Khởi tạo 1 user instance
    const user = userEvent.setup();
    // Khởi tạo 1 mockup function onClick bằng Jest
    const onClick = jest.fn();
    // Mount component <Button/> vào DOM ảo trong môi trường test
    render(<Button content="Click me" onClick={onClick} />);
    // Dùng Object screen để truy vấn global tìm button
    // Dùng getByRole tìm element với role="button" và name=/click me/i (regular expression) name chính là nội dung hiển thị của button
    const button = screen.getByRole("button", { name: /click me/i });
    // Mô phỏng 1 click của người dùng vào button
    await user.click(button);

    // Kiểm tra button có bị un-mount chưa
    expect(button).toBeInTheDocument();
    // Kiểm tra mock onClick function có được gọi 1 lần chưa
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
