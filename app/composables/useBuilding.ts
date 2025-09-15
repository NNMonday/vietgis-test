import type Building from "~~/shared/types/building";

export const useBuilding = () => {
  const buildings = ref<Building[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBuildings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch("/api/building");
      buildings.value = (response.data || []).map((b: any) => ({
        ...b,
        representative: {
          ...b.representative,
          cccdIssuedDate: new Date(b.representative.cccdIssuedDate),
        },
      }));
      return buildings.value;
    } finally {
      loading.value = false;
    }
  };

  const createBuilding = async (building: Omit<Building, "id">) => {
    const newBuilding = {
      ...building,
      id: Date.now(),
    };
    await $fetch("/api/building", {
      method: "POST",
      body: newBuilding,
    });
    return newBuilding;
  };

  const updateBuilding = async (building: Building) => {
    await $fetch("/api/building", {
      method: "PUT",
      body: building,
    });
  };

  const deleteBuilding = async (id: number) => {
    await $fetch(`/api/building/${id}`, {
      method: "DELETE",
    });
  };

  const fetchBuildingById = async (id: number) => {
    return await $fetch(`/api/building/${id}`);
  };

  return {
    buildings,
    loading,
    error,
    fetchBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    fetchBuildingById,
  };
};
