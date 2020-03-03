/**
 * js dictonary implementation
 * @param key
 * @param value
 */

interface KeyValue<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export default class Dictionary<TKey, TValue> {
  private elements: KeyValue<TKey, TValue>[] = [];

  add(key: TKey, value: TValue): void {
    const keyValue = { key: key, value: value } as KeyValue<TKey, TValue>;

    const index = this.findIndex(key);

    if (index < 0) {
      this.elements.push(keyValue);
    } else {
      this.elements[index] = keyValue;
    }
  }

  get(key: TKey): TValue | null {
    const keyValue = this.elements.find(element => {
      return element.key === key;
    });

    return keyValue ? keyValue.value : null;
  }

  remove(key: TKey): TValue | null {
    const index = this.findIndex(key);

    if (index < 0) {
      return null;
    }

    const keyValue = this.elements.splice(index, 1);
    return keyValue[0].value;
  }

  count(): number {
    return this.elements.length;
  }

  private findIndex(key: TKey): number {
    return this.elements.findIndex(element => {
      return element.key === key;
    });
  }
}
