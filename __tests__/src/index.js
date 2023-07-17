describe("Index - server", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "log").mockImplementation(() => {}); //silence console.log in tests
  });
  afterAll(() => {
    jest.resetModules();
  });
  it("should return 200", async () => {
    const mockApp = {
      use: jest.fn(),
      listen: jest.fn(),
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    jest.mock("express", () => {
      return () => {
        return mockApp;
      };
    });
    // const dotenv = jest.mock("dotenv/config", () => jest.fn());
    jest.mock("firebase/database", () => {
      return {
        getDatabase: jest.fn(),
        ref: jest.fn(),
        set: jest.fn(),
        onValue: jest.fn(),
      };
    });
    jest.mock('firebase/app', () => {
      return {
        initializeApp: jest.fn(),
      };
    });
    require("../../src/index.js");
    expect(mockApp.use).toHaveBeenCalled();
    expect(mockApp.use).toHaveBeenCalledWith(expect.any(Function));
    expect(mockApp.listen).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalledWith("3000", expect.any(Function));
    expect(mockApp.get).toHaveBeenCalled();
    expect(mockApp.get).toHaveBeenCalledWith("/api/notes", expect.any(Function));
    expect(mockApp.post).toHaveBeenCalledWith("/api/notes", expect.any(Function));
    expect(mockApp.put).toHaveBeenCalledWith(
      "/api/notes/",
      expect.any(Function)
    );
    expect(mockApp.delete).toHaveBeenCalledWith(
      "/api/notes/",
      expect.any(Function)
    );
  });
});
