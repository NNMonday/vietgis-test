import buildings from "~~/shared/data/building";

export default defineEventHandler(async (e) => {
  const newBuilding = await readBody(e);

  const buildingWithDefaults = {
    ...newBuilding,
    representative: {
      name: newBuilding.representative?.name || "",
      phone: newBuilding.representative?.phone || "",
      cccd: newBuilding.representative?.cccd || "",
      cccdIssuedDate: newBuilding.representative?.cccdIssuedDate || new Date(),
    },
  };

  buildings.push(buildingWithDefaults);
  return buildingWithDefaults;
});
