import L from "leaflet";

export default defineNuxtPlugin(() => {
  window.L = L;
});
