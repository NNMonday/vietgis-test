import type { Marker } from "leaflet";

export const useLeafletMap = (containerId: string) => {
  const map = ref<any>(null);

  const markers = ref<Map<number, Marker>>(new Map());

  const initializeMap = async (center: [number, number] = [0, 0], zoom = 2) => {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Map container with ID '${containerId}' not found`);
    }

    if (map.value) {
      map.value.remove();
    }

    const L = window.L;

    map.value = L.map(containerId).setView(center, zoom);

    L.tileLayer("https://tile.openstreetMap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap contributors",
    }).addTo(map.value);

    return map.value;
  };

  const addMarker = (
    id: number,
    markerOrCoords: Marker | [number, number],
    popupContent?: string
  ) => {
    const L = (window as any).L;
    if (!L) return;

    let marker: Marker;

    if (Array.isArray(markerOrCoords)) {
      marker = L.marker(markerOrCoords);
      if (popupContent) marker.bindPopup(popupContent);
    } else {
      marker = markerOrCoords;
    }

    marker.addTo(map.value);
    markers.value.set(id, marker);

    return marker;
  };

  const removeMarker = (id: number) => {
    const marker = markers.value.get(id);
    if (marker) {
      marker.remove();
      markers.value.delete(id);
    }
  };

  const clearMarkers = () => {
    markers.value.forEach((marker) => marker.remove());
    markers.value.clear();
  };

  return {
    map,
    markers,
    initializeMap,
    addMarker,
    removeMarker,
    clearMarkers,
  };
};
