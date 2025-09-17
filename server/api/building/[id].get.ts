import { getBuildingByIdFromJSON } from "../../utils/buildingData";

export default defineEventHandler(async (e) => {
  const id = e.context.params?.id;
  const result = await getBuildingByIdFromJSON(Number(id));
  if (result) {
    return result;
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: "Building not found",
    });
  }
});
