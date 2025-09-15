<template>
  <ClientOnly>
    <div id="map" class="h-full"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type Building from "~~/shared/types/building";

const { selectedBuilding, refreshKey } = defineProps<{
  refreshKey: number;
  selectedBuilding?: Building;
}>();

const { map, initializeMap, addMarker, clearMarkers, markers } =
  useLeafletMap("map");

const { fetchBuildings } = useBuilding();

const loadBuildings = async () => {
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

const { handleError } = useToastHandler();
const initializeMapAndLoadData = async () => {
  try {
    initializeMap([0, 0], 2);
    await loadBuildings();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        if (map.value) {
          map.value.setView([lat, long], 13);
        }
      });
    }
  } catch (error) {
    handleError(`Failed to initialize map: ${error}`);
  }
};

onMounted(async () => {
  await nextTick();
  await initializeMapAndLoadData();
});

watch(
  () => selectedBuilding,
  (currentBuilding) => {
    if (!currentBuilding?.coords || !map.value) {
      return;
    }
    const lat = currentBuilding.coords.lat;
    const long = currentBuilding.coords.long;
    map.value.flyTo([lat, long], 15);
    const marker = markers.value.get(currentBuilding.id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 100);
    }
  }
);

watch(
  () => refreshKey,
  async () => {
    await loadBuildings();
  }
);

onBeforeUnmount(() => {
  if (map.value) {
    map.value.remove();
  }
});
</script>
