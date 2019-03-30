import {
  getKeyFromObject,
  loadFromStorage,
  saveToStorage,
  setKeyToObject
} from '../../utils/localStorage';
import { reachCreateError } from '..';
import { ReachLocalStorage, ReachLocalStoragePaths } from './reachServiceTypes';

export function getLocalValue<K extends ReachLocalStoragePaths>(
  storage: ReachLocalStorage,
  path: K
) {
  const localStorage = loadFromStorage(storage.storageKey) || {};
  const storageValue = storage[path];

  if (!storageValue) {
    throw reachCreateError(
      500,
      `"${path}" not provided in localstorage with ReachProvider`
    );
  }

  return getKeyFromObject(localStorage, storageValue.split('.'));
}

export function setLocalValue<K extends ReachLocalStoragePaths>(
  storage: ReachLocalStorage,
  path: K,
  value: any
) {
  const localStorage = loadFromStorage(storage.storageKey) || {};
  const storageValue = storage[path];

  if (!storageValue) {
    throw reachCreateError(
      500,
      `"${path}" not provided in localstorage with ReachProvider`
    );
  }

  const updated = setKeyToObject(localStorage, storageValue.split('.'), value);

  if (updated) {
    saveToStorage(storage.storageKey, updated);
  }
}
