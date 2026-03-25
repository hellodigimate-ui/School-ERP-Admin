export function getItems<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function addItem<T extends { id: string }>(key: string, item: T): void {
  const items = getItems<T>(key);
  items.push(item);
  setItems(key, items);
}

export function updateItem<T extends { id: string }>(key: string, updated: T): void {
  const items = getItems<T>(key);
  const idx = items.findIndex((i) => i.id === updated.id);
  if (idx !== -1) {
    items[idx] = updated;
    setItems(key, items);
  }
}

export function deleteItem<T extends { id: string }>(key: string, id: string): void {
  const items = getItems<T>(key).filter((i) => i.id !== id);
  setItems(key, items);
}

export function generateId(): string {
  return crypto.randomUUID();
}
