<template>
  <slot />
</template>

<script setup lang="ts">
const props = defineProps<{
  formContext: any;
}>();

provide("formContext", toRef(props, "formContext"));
</script>
