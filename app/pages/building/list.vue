<template>
  <div class="w-full grid grid-cols-2 h-screen overflow-hidden">
    <div class="h-screen">
      <MapBase mode="list" @map-ready="onMapReady" />
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
      <ClientOnly>
        <BuildingDataTable
          @building-selected="onBuildingSelected"
          @building-updated="loadBuildings"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Building from "~~/shared/types/building";

definePageMeta({ layout: "bootstrap" });

let leafletApi: ReturnType<typeof useLeafletMap> | null = null;

const { fetchBuildings } = useBuilding();

const onMapReady = (api: ReturnType<typeof useLeafletMap>) => {
  leafletApi = api;
  loadBuildings();
};

const onBuildingSelected = (data: Building) => {
  if (!data?.coords || !leafletApi?.map.value) return;

  const lat = data.coords.lat;
  const long = data.coords.long;

  leafletApi.map.value.flyTo([lat, long], 15);

  const marker = leafletApi.markers.value.get(data.id);
  if (marker) {
    setTimeout(() => marker.openPopup(), 100);
  }
};

const loadBuildings = async () => {
  if (!leafletApi) return;

  const { clearMarkers, addMarker } = leafletApi;

  const data = await fetchBuildings();
  clearMarkers();
  data?.forEach((b) => {
    addMarker(
      b.id,
      [b.coords.lat, b.coords.long],
      `
      <div>
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${b.name}</h3>
        <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Address:</strong> ${b.address}</p>
        <p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Lat:</strong> ${b.coords.lat}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Long:</strong> ${b.coords.long}</p>
      </div>
      `
    );
  });
};
</script>
