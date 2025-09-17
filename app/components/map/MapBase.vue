<template>
  <div id="map" class="h-full w-full"></div>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: "map-ready", map: any): void;
}>();

const { initializeMap, ...args } = useLeafletMap("map");
const { handleWarn } = useToastHandler();

onMounted(async () => {
  await nextTick();
  await initializeMap();
  emit("map-ready", {
    ...args,
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        args.map.value.setView(
          [position.coords.latitude, position.coords.longitude],
          13
        );
      },
      () => {
        // handleWarn("Could not get your location, using default position");
      }
    );
  } else {
    handleWarn("Geolocation is not supported by this browser");
  }
});

onBeforeUnmount(() => {
  args.map.value?.remove();
});
</script>
