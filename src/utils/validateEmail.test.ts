import { validateEmail } from "~/utils/validateEmail";

describe("Unit test: validateEmail()", () => {
  const testCases: any[] = [
    ["maitrucquynh111@gmail.com", true],
    ["mtq@icttm.net", true],
    ["@gmai.", false],
    ["quinn@.com", false],
    // [{ email: "mtq111@gmail.com" }, true],
  ];

  // Dùng each để lặp qua các test case và test cho từng test case, giúp chúng ta viết test ngắn gọn hơn khi có nhiều bộ dữ liệu test lặp đi lặp lại cho cùng 1 logic.
  // %p chúng ta sử dụng như 1 dạng placeholder kiểu pretty-format in ra log giá trị gốc khi test được thực thi. Giúp dễ debug test case bị fail
  // Tham khảo: https://jestjs.io/docs/api#1-testeachtablename-fn-timeout
  it.each(testCases)("%p ==> %p", (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});
