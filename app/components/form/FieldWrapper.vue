<template>
  <div class="flex flex-col gap-1 w-full">
    <label :for="name" class="text-sm font-medium">
      {{ label }}
      <RedAsterisk v-if="required" />
    </label>
    <slot />
    <Message
      v-if="fieldError?.invalid"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ fieldError?.error.message }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import RedAsterisk from "./RedAsterisk.vue";

const props = defineProps<{
  label: string;
  name: string;
  formContext?: any;
  required?: boolean;
}>();

const injectedFormContext = inject("formContext");
const formContext = computed(
  () => unref(injectedFormContext) || props.formContext
);

const fieldError = computed(() => {
  if (!formContext.value) return null;
  return getNestedProperty(formContext.value, props.name);
});
</script>
