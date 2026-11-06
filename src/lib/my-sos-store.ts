const KEY = "floodaid:my-sos-ids";
const LEGACY_KEY = "floodaid:last-sos-id";

export function readMySosIds(): string[] {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const legacy = localStorage.getItem(LEGACY_KEY);
    const ids: string[] = Array.isArray(list) ? list.filter((x) => typeof x === "string") : [];
    if (legacy && !ids.includes(legacy)) ids.push(legacy);
    return ids.slice(0, 10);
  } catch {
    return [];
  }
}

export function rememberSosId(id: string) {
  try {
    const ids = [id, ...readMySosIds().filter((x) => x !== id)].slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify(ids));
    localStorage.setItem(LEGACY_KEY, id);
  } catch {
    return;
  }
}

export function forgetSosId(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(readMySosIds().filter((x) => x !== id)));
    if (localStorage.getItem(LEGACY_KEY) === id) localStorage.removeItem(LEGACY_KEY);
  } catch {
    return;
  }
}
