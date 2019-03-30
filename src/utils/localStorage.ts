function loadFromStorage(store: string) {
  try {
    const serializedStore = localStorage.getItem(store);
    return JSON.parse(serializedStore || '');
  } catch (error) {
    return undefined;
  }
}

function saveToStorage(store: string, object: any) {
  try {
    localStorage.setItem(store, JSON.stringify(object));
  } catch (error) {
    // Ignore write errors
  }
}

function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    return false;
  }
}

interface ObjectWithKeys<T> {
  [key: string]: ObjectWithKeys<T> | T;
}

function getKeyFromObject<T = string>(
  obj: ObjectWithKeys<T>,
  keyPath: string[],
  keyIndex = 0
): T | null {
  const key = keyPath[keyIndex];

  if (obj[key]) {
    if (keyIndex === keyPath.length - 1) {
      return obj[key] as T;
    } else if (typeof obj[key] === 'object') {
      return getKeyFromObject(
        obj[key] as ObjectWithKeys<T>,
        keyPath,
        keyIndex + 1
      );
    }
  }

  return null;
}

function setKeyToObject(
  obj: ObjectWithKeys<any>,
  keyPath: string[],
  value: any,
  keyIndex = 0
): ObjectWithKeys<any> | null {
  const key = keyPath[keyIndex];

  if (!obj) {
    obj = {};
  }

  if (keyIndex === keyPath.length - 1) {
    obj[key] = value;
    return obj;
  }

  if (!obj[key]) {
    obj[key] = setKeyToObject(obj[key], keyPath, value, keyIndex + 1);
  } else if (typeof obj[key] === 'object') {
    obj[key] = setKeyToObject(obj[key], keyPath, value, keyIndex + 1);
  }

  return obj;
}

export {
  saveToStorage,
  loadFromStorage,
  clearStorage,
  getKeyFromObject,
  setKeyToObject
};
