import buildings from "~~/shared/data/building";

export default defineEventHandler(async (e) => {
  const updatedBuilding = await readBody(e);

  const buildingIndex = buildings.findIndex(
    (building) => building.id === updatedBuilding.id
  );

  if (buildingIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Building not found",
    });
  }

  const buildingWithDefaults = {
    ...updatedBuilding,
    representative: {
      name: updatedBuilding.representative?.name || "",
      phone: updatedBuilding.representative?.phone || "",
      cccd: updatedBuilding.representative?.cccd || "",
      cccdIssuedDate:
        updatedBuilding.representative?.cccdIssuedDate || new Date(),
    },
  };

  buildings[buildingIndex] = buildingWithDefaults;

  return buildingWithDefaults;
});
