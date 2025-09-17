<template>
  <div id="map-form" class="h-full w-full"></div>
</template>

<script setup lang="ts">
import type { LeafletMouseEvent, Marker } from "leaflet";
import type Building from "~~/shared/types/building";

const props = defineProps<{
  building?: Building;
}>();

const emit = defineEmits<{
  (
    e: "map-ready",
    api: ReturnType<typeof useLeafletMap> & {
      updateMarkerAndFields: typeof updateMarkerAndFields;
    }
  ): void;
  (e: "coords-updated", coords: { lat: number; long: number }): void;
}>();

const { handleError, handleWarn } = useToastHandler();
const { map, initializeMap, addMarker, clearMarkers, markers } =
  useLeafletMap("map-form");

let coordsUpdateTimeout: ReturnType<typeof setTimeout> | null = null;

const dynamicMarker = computed(() => {
  if (!window.L || !props.building?.coords) return null;

  return window.L.marker(
    [props.building.coords.lat, props.building.coords.long],
    { draggable: true }
  )
    .bindPopup(props.building.name || "Please enter building name")
    .on("dragend", (e) => {
      const { lat, lng } = (e.target as Marker).getLatLng();
      emit("coords-updated", { lat, long: lng });
      (e.target as Marker).setPopupContent(
        props.building?.name || "Please enter building name"
      );
    });
});

const updateMarkerAndFields = ({
  lat = 0,
  long = 0,
  focus = false,
  updateFormValues = true,
  zoom = map.value?.getZoom(),
}: {
  lat?: number;
  long?: number;
  focus?: boolean;
  updateFormValues?: boolean;
  zoom?: number;
}) => {
  if (!dynamicMarker.value) return;

  clearMarkers();
  addMarker(-1, dynamicMarker.value);

  if (updateFormValues) emit("coords-updated", { lat, long });
  if (focus) map.value?.setView([lat, long], zoom || 13);
};

const getUserLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3000,
    });
  });
};

const getInitialCoords = async (): Promise<[number, number]> => {
  const buildingCoords = props.building?.coords;
  if (buildingCoords && buildingCoords.lat !== 0 && buildingCoords.long !== 0) {
    return [buildingCoords.lat, buildingCoords.long];
  }

  try {
    const position = await getUserLocation();
    return [position.coords.latitude, position.coords.longitude];
  } catch (error) {
    // handleWarn("Could not get your location, using default position");
    return [0, 0];
  }
};

const setupMapEvents = () => {
  map.value.on("click", (e: LeafletMouseEvent) => {
    updateMarkerAndFields({
      focus: true,
      lat: e.latlng.lat,
      long: e.latlng.lng,
    });
  });
};

const setupInitialMarker = async () => {
  const buildingCoords = props.building?.coords;
  if (buildingCoords && buildingCoords.lat !== 0 && buildingCoords.long !== 0) {
    updateMarkerAndFields({
      lat: buildingCoords.lat,
      long: buildingCoords.long,
      focus: false,
      updateFormValues: false,
      zoom: 13,
    });
    return;
  }

  try {
    const position = await getUserLocation();

    updateMarkerAndFields({
      lat: position.coords.latitude,
      long: position.coords.longitude,
      focus: false,
      updateFormValues: true,
      zoom: 13,
    });
  } catch (error) {
    updateMarkerAndFields({
      lat: 0,
      long: 0,
      focus: false,
      updateFormValues: true,
      zoom: 2,
    });
    // handleWarn((error as Error).message);
  }
};

const initializeMapAndLoadData = async () => {
  try {
    const coords = await getInitialCoords();
    await initializeMap(coords, 2);

    setupMapEvents();

    emit("map-ready", {
      map,
      markers,
      initializeMap,
      addMarker,
      removeMarker: (id: number) => {
        const marker = markers.value.get(id);
        if (marker) {
          marker.remove();
          markers.value.delete(id);
        }
      },
      clearMarkers,
      updateMarkerAndFields,
    });

    await setupInitialMarker();
  } catch (error) {
    handleError(`Failed to initialize map: ${error}`);
  }
};

watch(
  () => props.building?.coords,
  (newCoords) => {
    if (!newCoords || !map.value || !markers.value.get(-1)) return;

    if (coordsUpdateTimeout) clearTimeout(coordsUpdateTimeout);
    coordsUpdateTimeout = setTimeout(() => {
      updateMarkerAndFields({
        lat: newCoords.lat,
        long: newCoords.long,
        focus: true,
        updateFormValues: false,
      });
    }, 500);
  },
  { deep: true }
);

watch(
  () => props.building?.name,
  (name) => {
    const content = name || "Please enter building name";
    markers.value.get(-1)?.setPopupContent(content);
  }
);

onMounted(async () => {
  await nextTick();
  await initializeMapAndLoadData();
});

onBeforeUnmount(() => {
  if (coordsUpdateTimeout) clearTimeout(coordsUpdateTimeout);
  map.value?.remove();
});
</script>
