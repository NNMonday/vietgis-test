<template>
  <ClientOnly>
    <div
      class="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6"
    >
      <div
        class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 p-8"
      >
        <h1
          class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100"
        >
          {{ title }}
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Form
            ref="form"
            v-slot="$form"
            :initialValues="initialValues"
            :resolver="resolver"
            @submit="onFormSubmit"
          >
            <FormProvider :formContext="$form">
              <div class="flex flex-col gap-5">
                <FormFieldWrapper required label="Building Name" name="name">
                  <InputText
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Building name"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  required
                  label="Building Address"
                  name="address"
                >
                  <Textarea
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Building address"
                    rows="3"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <div class="grid grid-cols-2 gap-4">
                  <FormFieldWrapper
                    required
                    label="Longitude"
                    name="coords.long"
                  >
                    <InputNumber
                      id="coords.long"
                      :maxFractionDigits="6"
                      name="coords.long"
                      placeholder="Longitude"
                      fluid
                      class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </FormFieldWrapper>
                  <FormFieldWrapper required label="Latitude" name="coords.lat">
                    <InputNumber
                      id="coords.lat"
                      name="coords.lat"
                      :maxFractionDigits="6"
                      placeholder="Latitude"
                      fluid
                      class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </FormFieldWrapper>
                </div>

                <FormFieldWrapper
                  label="Representative Name"
                  name="representative.name"
                >
                  <InputText
                    id="representative.name"
                    name="representative.name"
                    type="text"
                    placeholder="Representative name"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Representative Phone"
                  name="representative.phone"
                >
                  <InputText
                    id="representative.phone"
                    name="representative.phone"
                    type="text"
                    placeholder="Representative phone"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Representative CCCD"
                  name="representative.cccd"
                >
                  <InputText
                    id="representative.cccd"
                    name="representative.cccd"
                    type="text"
                    placeholder="Representative CCCD"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <FormFieldWrapper
                  label="Representative CCCD Issued Date"
                  name="representative.cccdIssuedDate"
                >
                  <DatePicker
                    id="representative.cccdIssuedDate"
                    name="representative.cccdIssuedDate"
                    fluid
                    class="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </FormFieldWrapper>

                <Button
                  type="submit"
                  label="Submit"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white border-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white transition-colors"
                />
              </div>
              <!-- <pre>{{ $form }}</pre> -->
            </FormProvider>
          </Form>
          <div
            class="h-[600px] rounded-xl overflow-hidden shadow-inner dark:shadow-gray-900 dark:bg-gray-800"
          >
            <div id="map" class="h-full w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";
import { Form } from "@primevue/forms";
import type Building from "~~/shared/types/building";
import type { LeafletMouseEvent, Marker } from "leaflet";

const props = defineProps<{
  building?: Building;
  title: string;
}>();
const emit = defineEmits<{
  onSubmit: [building: Building];
}>();

const { building, title } = props;
let coordsUpdateTimeout: ReturnType<typeof setTimeout> | null = null;
const { handleError } = useToastHandler();
const form = ref();
const { map, initializeMap, addMarker, clearMarkers, markers } =
  useLeafletMap("map");

const { initialValues, resolver } = useBuildingValidation();
const onFormSubmit = ({ valid, reset, values }: FormSubmitEvent) => {
  if (valid) {
    emit("onSubmit", values as Building);
    reset();
  } else {
    handleError("Please fullfil the form requirements");
  }
};

const dynamicMarker = computed(() => {
  return window.L?.marker(
    [
      form.value?.getFieldState("coords.lat").value,
      form.value?.getFieldState("coords.long").value,
    ],
    { draggable: true }
  )
    .bindPopup(
      form.value.getFieldState("name").value || "Please enter building name"
    )
    .on("dragend", (e) => {
      const newLat = (e.target as Marker).getLatLng().lat;
      const newLng = (e.target as Marker).getLatLng().lng;
      form.value.setFieldValue("coords.lat", newLat);
      form.value.setFieldValue("coords.long", newLng);
      (e.target as Marker).setPopupContent(
        form.value.getFieldState("name").value || "Please enter building name"
      );
    });
});

let fromMapClick = ref(false);
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
  title?: string;
  updateFormValues?: boolean;
  zoom?: number;
}): void => {
  clearMarkers();
  addMarker(-1, dynamicMarker.value);

  if (updateFormValues) {
    form.value.setFieldValue("coords.lat", lat);
    form.value.setFieldValue("coords.long", long);
  }

  if (focus) {
    const currentZoom = zoom || 13;
    map.value?.setView([lat, long], currentZoom);
  }
};

const initializeMapAndLoadData = async () => {
  try {
    initializeMap([0, 0], 2);

    map.value.on("click", (e: LeafletMouseEvent) => {
      fromMapClick.value = true;
      updateMarkerAndFields({
        focus: true,
        lat: e.latlng.lat,
        long: e.latlng.lng,
      });
    });

    if (building) {
      updateMarkerAndFields({
        lat: building.coords.lat,
        long: building.coords.long,
        focus: true,
        updateFormValues: false,
        zoom: 13,
      });
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);

            updateMarkerAndFields({
              lat: position.coords.latitude,
              long: position.coords.longitude,
              focus: true,
              zoom: 13,
            });
          },
          (e) => {
            console.log(e);

            handleError("Could not get your location");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 3000,
          }
        );
      } else {
        handleError("Geolocation is not supported by this browser");
      }
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
  () => [
    form.value?.getFieldState("coords.lat").value,
    form.value?.getFieldState("coords.long").value,
  ],
  ([lat, long]) => {
    if (coordsUpdateTimeout) clearTimeout(coordsUpdateTimeout);

    const timeoutDuration = fromMapClick.value ? 0 : 500;
    coordsUpdateTimeout = setTimeout(() => {
      if (lat != null && long != null && map.value && markers.value.get(-1)) {
        updateMarkerAndFields({
          lat,
          long,
          focus: true,
          updateFormValues: false,
        });
      }
      fromMapClick.value = false;
    }, timeoutDuration);
  }
);

watch(
  () => form.value?.getFieldState("name").value,
  (name) => {
    const content = name || "Please enter building name";
    if (markers.value.get(-1)) {
      markers.value.get(-1)?.setPopupContent(content);
    }
  }
);

watch(
  () => building,
  async (newBuilding) => {
    if (newBuilding) {
      await nextTick();
      if (form.value) {
        form.value.setFieldValue("name", newBuilding.name);
        form.value.setFieldValue("address", newBuilding.address);
        form.value.setFieldValue("coords.lat", newBuilding.coords.lat);
        form.value.setFieldValue("coords.long", newBuilding.coords.long);
        form.value.setFieldValue(
          "representative.name",
          newBuilding.representative.name
        );
        form.value.setFieldValue(
          "representative.phone",
          newBuilding.representative.phone
        );
        form.value.setFieldValue(
          "representative.cccd",
          newBuilding.representative.cccd
        );
        form.value.setFieldValue(
          "representative.cccdIssuedDate",
          newBuilding.representative.cccdIssuedDate
        );
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
