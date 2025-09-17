import fs from "fs";
import path from "path";
import type Building from "~~/shared/types/building";

const DATA_FILE_PATH = path.resolve("./shared/data/buildings.json");

export async function readBuildingsFromJSON(): Promise<Building[]> {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const buildings = JSON.parse(data);

    return buildings.map((building: any) => ({
      ...building,
      representative: {
        ...building.representative,
        cccdIssuedDate: new Date(building.representative.cccdIssuedDate),
      },
    }));
  } catch (error) {
    console.error("Error reading buildings from JSON:", error);
    return [];
  }
}

export async function writeBuildingsToJSON(
  buildings: Building[]
): Promise<void> {
  try {
    const buildingsForJSON = buildings.map((building) => ({
      ...building,
      representative: {
        ...building.representative,
        cccdIssuedDate: new Date(
          building.representative.cccdIssuedDate
        ).toISOString(),
      },
    }));

    const data = JSON.stringify(buildingsForJSON, null, 2);
    fs.writeFileSync(DATA_FILE_PATH, data, "utf-8");
  } catch (error) {
    console.error("Error writing buildings to JSON:", error);
    throw error;
  }
}

export async function addBuildingToJSON(
  newBuilding: Building
): Promise<Building> {
  const buildings = await readBuildingsFromJSON();
  buildings.push(newBuilding);
  await writeBuildingsToJSON(buildings);
  return newBuilding;
}

export async function updateBuildingInJSON(
  updatedBuilding: Building
): Promise<Building> {
  const buildings = await readBuildingsFromJSON();
  const buildingIndex = buildings.findIndex(
    (building) => building.id === updatedBuilding.id
  );

  if (buildingIndex === -1) {
    throw new Error("Building not found");
  }

  buildings[buildingIndex] = updatedBuilding;
  await writeBuildingsToJSON(buildings);
  return updatedBuilding;
}

export async function deleteBuildingFromJSON(
  buildingId: number
): Promise<Building> {
  const buildings = await readBuildingsFromJSON();
  const buildingIndex = buildings.findIndex(
    (building) => building.id === buildingId
  );

  if (buildingIndex === -1) {
    throw new Error("Building not found");
  }

  const deletedBuilding = buildings.splice(buildingIndex, 1)[0];
  await writeBuildingsToJSON(buildings);
  return deletedBuilding;
}

export async function getBuildingByIdFromJSON(
  buildingId: number
): Promise<Building | null> {
  const buildings = await readBuildingsFromJSON();
  return buildings.find((building) => building.id === buildingId) || null;
}
