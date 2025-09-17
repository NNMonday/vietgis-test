import { addBuildingToJSON } from "../../utils/buildingData";

export default defineEventHandler(async (e) => {
  const newBuilding = await readBody(e);

  const buildingWithDefaults = {
    ...newBuilding,
    representative: {
      name: newBuilding.representative?.name || "",
      phone: newBuilding.representative?.phone || "",
      cccd: newBuilding.representative?.cccd || "",
      cccdIssuedDate: newBuilding.representative?.cccdIssuedDate
        ? new Date(newBuilding.representative.cccdIssuedDate)
        : new Date(),
    },
  };

  const savedBuilding = await addBuildingToJSON(buildingWithDefaults);
  return savedBuilding;
});
