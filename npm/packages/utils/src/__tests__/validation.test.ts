import { isValid, invalidNodes } from "../validation";

describe("Validation", () => {
  it("Should be a legal text", () => {
    const test: boolean = isValid("Hello");
    expect(test).toEqual(true);
  });

  it("Tags should not be a legal text", () => {
    const test: boolean = isValid("Hello <spar>friend</spar>");
    expect(test).toEqual(false);
  });

  it("Emoticons should not be a legal text", () => {
    const test: boolean = isValid("Hello 🤡");
    expect(test).toEqual(false);
  });

  it("Should return invalid tag nodes", () => {
    const text: string =
      "All <tags> are illegal, even HTML <h1> and <tags with spaces>, " +
      "but you can use >and< aslong as it does not form a tag";
    const test: string[] = invalidNodes(text);
    expect(test).toContain("<tags>");
    expect(test).toContain("<h1>");
    expect(test).toContain("<tags with spaces>");
    expect(test).not.toContain(">and<");
  });

  it("Should return invalid emoticon nodes", () => {
    const text = "All emoticons are illegal 😵 👺 ";
    const test: string[] = invalidNodes(text);
    expect(test).toContain("😵");
    expect(test).toContain("👺");
  });
});
