import { deleteBuildingFromJSON } from "../../utils/buildingData";

export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Building ID is required",
    });
  }

  const buildingId = parseInt(id);

  try {
    const deletedBuilding = await deleteBuildingFromJSON(buildingId);
    return {
      message: "Building deleted successfully",
      data: deletedBuilding,
    };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Building not found",
    });
  }
});
