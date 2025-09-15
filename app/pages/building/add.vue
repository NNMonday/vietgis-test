<template>
  <BuildingForm title="Building Registration" @on-submit="addBuilding" />
</template>
<script setup lang="ts">
import type Building from "~~/shared/types/building";

const { createBuilding } = useBuilding();
const { handleSuccess } = useToastHandler();
const addBuilding = async (newBuilding: Building) => {
  await createBuilding({ ...newBuilding });
  handleSuccess("Building has been added");
  useRouter().back();
};
</script>
