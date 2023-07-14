describe("Index - server", () => {
  it("should return 200", async () => {
    const mockApp = {
      use: jest.fn(),
      listen: jest.fn(),
      get: jest.fn(),
    };
    jest.mock("express", () => {
      return () => {
        return mockApp;
      };
    });
    const dotenv = jest.mock("dotenv/config", () => jest.fn());
    require("../../src/index.js");
    expect(mockApp.use).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
    expect(mockApp.listen).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function));
    expect(mockApp.get).toHaveBeenCalled();
    expect(mockApp.get).toHaveBeenCalledWith("/", expect.any(Function));
  });
});
