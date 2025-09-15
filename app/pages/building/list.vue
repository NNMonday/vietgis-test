<template>
  <ClientOnly>
    <div class="w-full grid grid-cols-2 h-screen overflow-hidden">
      <div class="h-screen">
        <BuildingMap
          :selected-building="selectedBuilding"
          :refresh-key="refreshKey"
        />
      </div>
      <div class="p-4 overflow-y-auto">
        <div class="flex justify-between items-center mb-3 pt-10">
          <h4 class="mb-0 text-xl font-semibold text-gray-800">Buildings</h4>
          <NuxtLink
            to="/building/add"
            class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200 inline-flex items-center"
          >
            Add Building
          </NuxtLink>
        </div>
        <BuildingDataTable
          @building-selected="onBuildingSelected"
          @building-updated="onBuildingListChanged"
        />
      </div>
    </div>
    <template #fallback> Loading ... </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type Building from "~~/shared/types/building";

definePageMeta({
  layout: "bootstrap",
});

const selectedBuilding = ref<Building>();
const refreshKey = ref(0);

const onBuildingSelected = (data: Building) => {
  selectedBuilding.value = data;
};

const onBuildingListChanged = () => {
  refreshKey.value++;
};
</script>
