import { TodoList } from "~/components/TodoList/TodoList";
import { render, screen } from "@testing-library/react";

/**
 *  Note: Sau khi chạy xong test này:
 * Việc có tồn tại vài dòng uncovered là bình thường, chấp nhận được. Vì sẽ có nhiều dòng code không cần phải test hết như log, debug, fallback, ...
 * Quan trong là các tính năng chính, logic nghiệp vụ, luồng người dùng quan trong đều phải được test.
 * Thực tế trong đa số dự án đều chỉ cần đạt 70-90% chứ không yêu cầu 100% hoàn hảo
 */

const MOCK_DATA = [
  { id: 1, todo: "Homework", completed: false, userId: 1 },
  { id: 2, todo: "Workout", completed: false, userId: 2 },
];

describe("<TodoList/> testing", () => {
  it("Fetch and display todo list", async () => {
    // globalThis: biến toàn cục chuẩn từ ES2020, chạy trên mọi môi trường, thay cho: window (trong browser), global (trong node.js), self (trong Web Worker)
    // jest.spyOn: Tạo 1 mock function cho object. Ở đây là globalThis.fetch
    // https://jestjs.io/docs/jest-object#jestspyonobject-methodname
    // mockResolvedValueOnce: lần gọi fetch tiếp theo sẽ trả về Promise.resolved với object bên dưới
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => ({ todos: MOCK_DATA }),
    } as any);
    render(<TodoList />);
    // getByText: chạy đồng bộ (synchronous) dùng khi chúng ta chắc chắn element đã có trong DOM
    // Kiểm tra chữ loading phải có sẵn trên màn hình
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // findByText: chạy bất đồng bộ (asynchronous) trả về Promise, sẽ chờ cho tới khi element xuất hiện trong DOM, thường dùng khi element sẽ xuất hiện trong 1 hành động async call API, setTimeout, ...
    // Kiểm tra tất cả todo trong MOCK_DATA đều xuất hiện trên màn hình
    for (const itemToto of MOCK_DATA) {
      expect(await screen.findByText(itemToto.todo)).toBeInTheDocument();
    }
  });

  it("Should display No Result if fetch data fail", async () => {
    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Internal Server"));

    render(<TodoList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    // Sau khi fetch lỗi, phải hiển thị No Result trên DOM
    expect(await screen.findByText(/no result/i)).toBeInTheDocument();
  });
});
