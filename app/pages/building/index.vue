<template></template>
<script setup>
const route = useRoute();
const router = useRouter();
const basePath = route.path.endsWith("/") ? route.path : route.path + "/";
router.push(`${basePath}list`);
</script>
