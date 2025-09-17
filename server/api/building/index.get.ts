import { readBuildingsFromJSON } from "../../utils/buildingData";
import Building from "~~/shared/types/building";

export default defineEventHandler(async (e) => {
  const data = await readBuildingsFromJSON();
  let filterData = [...data];

  const query = getQuery(e);
  const draw = parseInt(query.draw as string) || 1;
  const startParam = parseInt(query.start as string);
  const lengthParam = parseInt(query.length as string);
  const start = !isNaN(startParam) ? startParam : undefined;
  const length = !isNaN(lengthParam) ? lengthParam : undefined;
  const searchValue: string | RegExp = (query["search[value]"] as string) || "";
  const isRegex = (query["search[regex]"] as boolean) || false;
  if (searchValue) {
    if (isRegex) {
      const regex = new RegExp(searchValue);
      filterData = filterData.filter((b) =>
        collectValues(b).some((v) => regex.test(v))
      );
    } else {
      filterData = filterData.filter((b) =>
        collectValues(b).some((v) => v.includes(searchValue))
      );
    }
  }

  const columns = parseColumns(query);
  const orderColumn = query["order[0][column]"];
  if (orderColumn) {
    const orderName = columns[Number(orderColumn)].data as keyof Building;
    const orderDirection = query[`order[0][dir]`] || "";
    if (orderDirection) {
      filterData.sort((a, b) => {
        const aValue = getNestedProperty(a, orderName);
        const bValue = getNestedProperty(b, orderName);

        if (typeof aValue === "number" && typeof bValue === "number") {
          if (orderDirection === "asc") {
            return aValue - bValue;
          } else if (orderDirection === "desc") {
            return bValue - aValue;
          }
        } else {
          const aStr = String(aValue);
          const bStr = String(bValue);
          if (orderDirection === "asc") {
            return aStr.localeCompare(bStr);
          } else if (orderDirection === "desc") {
            return bStr.localeCompare(aStr);
          }
        }
        return 0;
      });
    }
  }

  return {
    data:
      start !== undefined && length !== undefined
        ? filterData.slice(start, start + length)
        : filterData,
    draw,
    recordsTotal: data.length,
    recordsFiltered: filterData.length,
  };
});
