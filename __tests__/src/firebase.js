import 'dotenv/config';
const { writeNote, readNotes } = require("../../src/firebase");
describe("Firebase", () => {
  it("should write a note to the database", async () => {
    jest.mock("firebase/app", () => {
      return {
        initializeApp: jest.fn(),
      };
    });

    jest.mock("firebase/database", () => {
      return {
        getDatabase: jest.fn(),
        ref: jest.fn().mockImplementation(() => ({
          userId: "123",
          id: "456",
          title: "Test note",
          content: "Test content",
          tags: ["test", "jest"],
        })),
        set: jest.fn().mockImplementation(() => ({
          userId: "123",
          id: "456",
          title: "Test note",
          content: "Test content",
          tags: ["test", "jest"],
        })),
        onValue: jest.fn(),
      };
    });

    const note = {
      userId: "123",
      id: "456",
      title: "Test note",
      content: "Test content",
      tags: ["test", "jest"]
    };

    await writeNote(note.userId, note).then((response) => {
      expect(response).toBe(undefined);
    });
  });

  xit("should read all user's notes from the database", async () => {
    const userId = "123"
    await readNotes(userId, (data) => {
      expect(data).toBe(undefined);
    });
  });

  // it("should read a single note from the database", async () => {
    
  // });
  // it's late and I'm tired
  // TODO: clean up those expect(undefined) tests and figure a better way to cover this, write tests for readNote, updateNote, deleteNote
});
