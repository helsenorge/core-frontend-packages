import Dictionary from "../dictionary";

describe("Dictionary", () => {
  it("Can add element", () => {
    const dictionary = new Dictionary<string, string>();
    dictionary.add("Key1", "Value1");
    expect(1).toEqual(dictionary.count());
  });

  it("Can update element", () => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, "Value1");
    dictionary.add(1, "NewValue");

    expect(1).toEqual(dictionary.count());
  });

  it("Can add more than one element", () => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, "Value1");
    dictionary.add(2, "Value2");
    dictionary.add(3, "Value3");
    dictionary.add(4, "Value4");

    expect(4).toEqual(dictionary.count());
  });

  it("Can get element by key", () => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, "Value1");
    dictionary.add(2, "Value2");
    dictionary.add(3, "Value3");
    dictionary.add(4, "Value4");

    expect("Value1").toEqual(dictionary.get(1));
    expect("Value2").toEqual(dictionary.get(2));
    expect("Value3").toEqual(dictionary.get(3));
    expect("Value4").toEqual(dictionary.get(4));
  });

  it("Can remove item by key", () => {
    const dictionary = new Dictionary<number, string>();
    dictionary.add(1, "Value1");
    dictionary.add(2, "Value2");
    dictionary.add(3, "Value3");
    dictionary.add(4, "Value4");

    const removed = dictionary.remove(3);

    expect("Value1").toEqual(dictionary.get(1));
    expect("Value2").toEqual(dictionary.get(2));
    expect(null).toEqual(dictionary.get(3));
    expect(removed).toEqual("Value3");
    expect("Value4").toEqual(dictionary.get(4));
  });
});
