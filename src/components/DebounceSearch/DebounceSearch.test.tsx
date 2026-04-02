import { DebounceSearch } from "~/components/DebounceSearch/DebounceSearch";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/** ========================================== TRUNGQUANDEV SOLUTION ========================================== */
// describe("<DebounceSearch /> TRUNGQUANDEV", () => {
//   it("Should fetch users after debounce", async () => {
//     // mock call với query cụ thể hoặc không có query
//     // mockImplementation: Gán cùng 1 logic mock cho toàn bộ các lần gọi fetch
//     jest.spyOn(globalThis, "fetch").mockImplementation(async (url: any) => {
//       if (url.includes("maiquynh")) {
//         return {
//           json: async () => [{ id: 1, name: "Quynh Mai" }],
//         } as Response;
//       }
//       return {
//         json: async () => [],
//       } as Response;
//     });
//     // Mount component <DebounceSearch /> vào DOM ảo trong môi trưởng test
//     render(<DebounceSearch />);

//     // Lần đầu gọi fetch với query rỗng
//     expect(globalThis.fetch).toHaveBeenCalledTimes(1);
//     expect(globalThis.fetch).toHaveBeenCalledWith(
//       expect.stringContaining("users?q="),
//     );

//     // Tìm ô input search và giả lập hành động gõ từng ký tự 'maiquynh' vào ô
//     await userEvent.type(screen.getByPlaceholderText(/search/i), "maiquynh");
//     // Lúc này decounce chưa xong xong, hàm fetch chưa được gọi lần 2
//     expect(globalThis.fetch).toHaveBeenCalledTimes(1);

//     // Dùng findByText để đợi khi debounce chạy xong và check kết quả trên UI
//     expect(await screen.findByText(/Quynh Mai/i)).toBeInTheDocument();

//     // Kiểm tra fetch được gọi lần 2 với query 'maiquynh'
//     expect(globalThis.fetch).toHaveBeenCalledTimes(2);
//     expect(globalThis.fetch).toHaveBeenCalledWith(
//       expect.stringContaining("users?q=maiquynh"),
//     );
//   });

//   it("Should display No Result if fetch data fail", async () => {
//     jest
//       .spyOn(globalThis, "fetch")
//       .mockRejectedValueOnce(new Error("Internal Server"));

//     render(<DebounceSearch />);
//     expect(screen.getByText(/loading/i)).toBeInTheDocument();
//     // Sau khi fetch lỗi, phải hiển thị No Result trên DOM
//     expect(await screen.findByText(/no result/i)).toBeInTheDocument();
//   });
// });

/** ========================================== CURSOR SOLUTION ========================================== */
// Mock lodash/debounce so the debounced function runs immediately (no delay)
jest.mock("lodash/debounce", () => (fn: (...args: unknown[]) => void) => fn);

const MOCK_USERS = [
  {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: { lat: "-37.3159", lng: "81.1496" },
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets",
    },
  },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "Shanna@melissa.tv",
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      zipcode: "90566-7771",
      geo: { lat: "-43.9509", lng: "-34.4618" },
    },
    phone: "010-692-6593 x09125",
    website: "anastasia.net",
    company: {
      name: "Deckow-Crist",
      catchPhrase: "Proactive didactic contingency",
      bs: "synergize scalable supply-chains",
    },
  },
];

describe("<DebounceSearch />", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("renders search input with correct placeholder", () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<DebounceSearch />);

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("fetches users on mount and displays user list", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => MOCK_USERS,
    } as Response);

    render(<DebounceSearch />);

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // After fetch resolves, shows user names
    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("shows Loading... while fetching", async () => {
    let resolvePromise: (value: unknown) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve as (value: unknown) => void;
    });

    jest.spyOn(globalThis, "fetch").mockReturnValueOnce(fetchPromise);

    render(<DebounceSearch />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    resolvePromise!({ json: async () => [] } as Response);
    await fetchPromise;
  });

  it("shows No result! when users array is empty", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<DebounceSearch />);

    expect(await screen.findByText(/no result!/i)).toBeInTheDocument();
  });

  it("shows No result! when fetch returns non-array", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => null,
    } as Response);

    render(<DebounceSearch />);

    // Component uses data || [], so {} is truthy but has no length
    expect(await screen.findByText(/no result!/i)).toBeInTheDocument();
  });

  it("calls fetch with search query when user types in input", async () => {
    const fetchSpy = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => MOCK_USERS,
    } as Response);

    render(<DebounceSearch />);

    // Wait for initial fetch
    await screen.findByText("Leanne Graham");

    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, "Leanne");

    // Debounce is mocked to run immediately, so fetch is called for initial load + each character
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenLastCalledWith(
      "https://jsonplaceholder.typicode.com/users?q=Leanne",
    );
  });

  it("handles fetch error and shows No result!", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("Network error"));

    render(<DebounceSearch />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/no result!/i)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith(
      "fetchUsers error",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });

  it("displays loading state then clears it after fetch completes", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => MOCK_USERS,
    } as Response);

    render(<DebounceSearch />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await screen.findByText("Leanne Graham");

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("renders user list with correct structure (ul with li items)", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => MOCK_USERS,
    } as Response);

    render(<DebounceSearch />);

    await screen.findByText("Leanne Graham");

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Leanne Graham");
    expect(items[1]).toHaveTextContent("Ervin Howell");
  });
});
