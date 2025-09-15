export const collectValues = (obj: any): string[] => {
  let values: string[] = [];

  if (obj == null) return values;

  if (typeof obj === "object") {
    for (const v of Object.values(obj)) {
      values = values.concat(collectValues(v));
    }
  } else {
    values.push(String(obj));
  }

  return values;
};

export function parseColumns(query: Record<string, any>): {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
  searchValue: string;
  searchRegex: boolean;
}[] {
  const columns: any[] = [];
  let i = 0;

  while (`columns[${i}][data]` in query) {
    columns.push({
      data: query[`columns[${i}][data]`],
      name: query[`columns[${i}][name]`] || "",
      searchable: query[`columns[${i}][searchable]`] === "true",
      orderable: query[`columns[${i}][orderable]`] === "true",
      searchValue: query[`columns[${i}][search][value]`] || "",
      searchRegex: query[`columns[${i}][search][regex]`] === "true",
    });
    i++;
  }

  return columns;
}

export function getNestedProperty(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}
