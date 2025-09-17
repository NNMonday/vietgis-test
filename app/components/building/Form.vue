<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center p-6"
  >
    <div
      class="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 p-8"
    >
      <h1 class="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
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
                <FormFieldWrapper required label="Longitude" name="coords.long">
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
          <MapForm
            :building="reactiveBuilding"
            @map-ready="onMapReady"
            @coords-updated="onCoordsUpdated"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";
import { Form } from "@primevue/forms";
import type Building from "~~/shared/types/building";

const props = defineProps<{
  building?: Building;
  title: string;
}>();
const emit = defineEmits<{
  onSubmit: [building: Building];
}>();

const { building, title } = props;
const { handleError } = useToastHandler();
const form = ref();

const reactiveBuilding = computed(() => {
  if (!form.value) return building;

  const formValues = {
    name: form.value.getFieldState("name").value || "",
    coords: {
      lat: form.value.getFieldState("coords.lat").value || 0,
      long: form.value.getFieldState("coords.long").value || 0,
    },
  };

  if (building) {
    return {
      ...building,
      name: formValues.name || building.name,
      coords: {
        lat: formValues.coords.lat || building.coords.lat,
        long: formValues.coords.long || building.coords.long,
      },
    };
  }

  return {
    id: 0,
    name: formValues.name,
    address: form.value.getFieldState("address").value || "",
    coords: formValues.coords,
    representative: {
      name: form.value.getFieldState("representative.name").value || "",
      phone: form.value.getFieldState("representative.phone").value || "",
      cccd: form.value.getFieldState("representative.cccd").value || "",
      cccdIssuedDate:
        form.value.getFieldState("representative.cccdIssuedDate").value ||
        new Date(),
    },
  };
});

let mapApi:
  | (ReturnType<typeof useLeafletMap> & { updateMarkerAndFields: any })
  | null = null;
let fromMapClick = ref(false);

const { initialValues, resolver } = useBuildingValidation();

const onFormSubmit = ({ valid, reset, values }: FormSubmitEvent) => {
  if (valid) {
    emit("onSubmit", values as Building);
    reset();
  } else {
    handleError("Please fullfil the form requirements");
  }
};

const onMapReady = (
  api: ReturnType<typeof useLeafletMap> & { updateMarkerAndFields: any }
) => {
  mapApi = api;
};

const onCoordsUpdated = (coords: { lat: number; long: number }) => {
  fromMapClick.value = true;
  if (form.value) {
    form.value.setFieldValue("coords.lat", coords.lat);
    form.value.setFieldValue("coords.long", coords.long);
  }
};

let coordsUpdateTimeout: ReturnType<typeof setTimeout> | null = null;
watch(
  () => [
    form.value?.getFieldState("coords.lat").value,
    form.value?.getFieldState("coords.long").value,
  ],
  ([lat, long]) => {
    if (coordsUpdateTimeout) clearTimeout(coordsUpdateTimeout);

    const timeoutDuration = fromMapClick.value ? 0 : 500;
    coordsUpdateTimeout = setTimeout(() => {
      if (
        lat != null &&
        long != null &&
        mapApi?.map.value &&
        mapApi?.markers.value.get(-1)
      ) {
        mapApi.updateMarkerAndFields({
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
