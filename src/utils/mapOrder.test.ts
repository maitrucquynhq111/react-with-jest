import { mapOrder } from "~/utils/mapOrder";

describe("Test function mapOrder", () => {
  it("Should return empty array [] if originalArray is empty", () => {
    expect(mapOrder(null as any, ["a", "b", "c"], "id")).toEqual([]);
  });

  it("Should return empty array [] if orderedArray is empty", () => {
    expect(mapOrder([1, 3, 2], null as any, "name")).toEqual([]);
  });

  it("Should return empty array [] if key is falsy", () => {
    expect(mapOrder([1, 3, 2], ["a", "b", "c"], "")).toEqual([]);
  });

  it("Should sort array by given order", () => {
    const originalArray = [
      { id: 1, name: "a" },
      { id: 3, name: "c" },
      { id: 2, name: "b" },
    ];
    const orderedArray = [1, 2, 3];
    const result = mapOrder(originalArray, orderedArray, "id");
    expect(result.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  it("Should push item not in orderedArray to the end", () => {
    const originalArray = [
      { id: 1, name: "a" },
      { id: 100, name: "Z" },
      { id: 3, name: "c" },
      { id: 2, name: "b" },
      { id: 99, name: "Y" },
    ];
    const orderedArray = [1, 4, 3];
    const result = mapOrder(originalArray, orderedArray, "id");
    expect(result.map((item) => item.id)).toEqual([1, 3, 100, 2, 99]);
  });

  it("Should handle when all items are not in orderedArray", () => {
    const originalArray = [
      { id: 1, name: "a" },
      { id: 100, name: "Z" },
      { id: 3, name: "c" },
      { id: 2, name: "b" },
      { id: 99, name: "Y" },
    ];
    const orderedArray = [] as any;
    const result = mapOrder(originalArray, orderedArray, "id");
    // Tất cả items trong originalArray không có trong orderedArray => Giữ nguyễn vị trí mảng gốc
    expect(result.map((item) => item.id)).toEqual([1, 100, 3, 2, 99]);
  });

  it("Should Work with custom key", () => {
    const originalArray = [
      { id: 1, name: "a" },
      { id: 100, name: "Z" },
      { id: 3, name: "c" },
      { id: 2, name: "b" },
      { id: 99, name: "Y" },
    ];
    const orderedArray = [1, 2, 3, 4];
    const result = mapOrder(originalArray, orderedArray, "code");
    // Khi key con sort không xuất hiện trong object của OriginalArray => Giữ nguyễn vị trí mảng gốc
    expect(result.map((item) => item.id)).toEqual([1, 100, 3, 2, 99]);
  });
});
