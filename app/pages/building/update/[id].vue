<template>
  <BuildingForm
    v-if="buildingData"
    title="Building Information"
    :building="buildingData"
    @on-submit="handleSubmit"
  />
  <div v-else>Loading...</div>
</template>
<script setup lang="ts">
import type Building from "~~/shared/types/building";

const { handleError, handleSuccess } = useToastHandler();
const id = useRoute().params.id;
const buildingData = ref<Building>();
const { updateBuilding } = useBuilding();

const handleSubmit = async (building: Building) => {
  try {
    await updateBuilding({
      ...building,
      id: Number(id),
    });
    handleSuccess("Building updated successfully");
    setTimeout(() => {
      useRouter().back();
    }, 1500);
  } catch (error: any) {
    handleError(error.statusMessage || "Failed to update building");
  }
};

const { fetchBuildingById } = useBuilding();
onMounted(async () => {
  try {
    const data = await fetchBuildingById(Number(id));
    buildingData.value = {
      ...data,
      representative: {
        ...data.representative,
        cccdIssuedDate: new Date(data.representative.cccdIssuedDate),
      },
    };
  } catch (error: any) {
    handleError(error.statusMessage || "Failed to load building");
    setTimeout(() => {
      useRouter().back();
    }, 1500);
  }
});
</script>
