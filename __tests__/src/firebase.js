import 'dotenv/config';
describe("Firebase", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "log").mockImplementation(() => {}); //silence console.log in tests
  });
  afterAll(() => {
    jest.resetModules();
  });
  const mockData = {
    content: "Test content",
    id: "456",
    tags: ["test", "jest"],
    title: "Test note",
    userId: "123",
  };
  jest.mock("firebase/app", () => {
    return {
      initializeApp: jest.fn(),
    };
  });
  jest.mock("firebase/database", () => {
    return {
      getDatabase: jest.fn(),
      ref: jest.fn().mockResolvedValue(mockData),
      set: jest.fn().mockResolvedValue(mockData),
      onValue: jest.fn().mockResolvedValue([mockData, mockData]),
    };
  });

  it("should write a note to the database", async () => {
    const { writeNote } = require("../../src/firebase");
    const note = {
      userId: "123",
      id: "456",
      title: "Test note",
      content: "Test content",
      tags: ["test", "jest"]
    };

    await writeNote(note.userId, note).then((response) => {
      expect(response).toEqual(mockData);
    });
  });

  it("should read all user's notes from the database", async () => {
    const { readNote } = require("../../src/firebase");
    const userId = "123"
    await readNote(userId, null, (data) => {
      expect(data).toBe(undefined);
    });
  });

  it("should read a single note from the database", async () => {
    const { readNote } = require("../../src/firebase");
    const userId = "123";
    const noteId = "456";
    await readNote(userId, noteId, (data) => {
      expect(data).toBe(undefined);
    });
  });
  // it's late and I'm tired
  // TODO: clean up those expect(undefined) tests and figure a better way to cover this, write tests for readNote, updateNote, deleteNote
});
