export function createDataTable<T>(
  objects: T[],
  headers: ([keyof T, string] | string)[]
) {
  return {
    headers: headers.map((x) => (Array.isArray(x) ? x[1] : x)),
    cells: objects.map((o) =>
      headers.map((h) => (Array.isArray(h) ? makeString(o[h[0]]) : "SLOT_" + h))
    ),
  };
}

function makeString(o: any) {
  return o.toString();
}
