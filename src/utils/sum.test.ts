import { sum } from "~/utils/sum";
// Jest runtime cung cấp describe , it và expect dưới dạng global function nên có thể dùng thẳng mà không cần import
/**
 * describe: Gom các test case lại với nhau
 * it: Tạo test case đơn lẻ
 * expect: kiểm tra kết quả có đúng mong đợi không
 */
describe("Test function sum", () => {
  it("Return the sum of two numbers", () => {
    expect(sum(2, 3)).toBe(5);
  });
});
