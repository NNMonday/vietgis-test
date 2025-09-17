import { updateBuildingInJSON } from "../../utils/buildingData";

export default defineEventHandler(async (e) => {
  const updatedBuilding = await readBody(e);

  const buildingWithDefaults = {
    ...updatedBuilding,
    representative: {
      name: updatedBuilding.representative?.name || "",
      phone: updatedBuilding.representative?.phone || "",
      cccd: updatedBuilding.representative?.cccd || "",
      cccdIssuedDate: updatedBuilding.representative?.cccdIssuedDate
        ? new Date(updatedBuilding.representative.cccdIssuedDate)
        : new Date(),
    },
  };

  try {
    const savedBuilding = await updateBuildingInJSON(buildingWithDefaults);
    return savedBuilding;
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "Building not found",
    });
  }
});
