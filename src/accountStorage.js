import {SAVE_KEY} from './progressStorage.js';

export function accountKey(userId) {
  return userId ? `${SAVE_KEY}:user:${userId}` : SAVE_KEY;
}
export function accountStorage(storage, userId) {
  const key = accountKey(userId);
  return {getItem: () => storage.getItem(key), setItem: (_, value) => storage.setItem(key, value)};
}
