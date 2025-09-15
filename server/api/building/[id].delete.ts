import data from "#shared/data/building";

export default defineEventHandler((e) => {
  const id = e.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Building ID is required",
    });
  }

  const buildingId = parseInt(id);

  const buildingIndex = data.findIndex(
    (building) => building.id === buildingId
  );

  if (buildingIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Building not found",
    });
  }

  const deletedBuilding = data.splice(buildingIndex, 1)[0];

  return {
    message: "Building deleted successfully",
    data: deletedBuilding,
  };
});
