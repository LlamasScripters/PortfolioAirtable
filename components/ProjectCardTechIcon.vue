<template>
  <img
    :src="tech.icon"
    :alt="tech.name"
    class="w-6 h-6 mx-1 hover:opacity-75"
  />
</template>

<script setup>
defineProps({
  tech: {
    type: Object,
    required: true,
    validator: (tech) => {
      return (
        typeof tech === "object" &&
        tech !== null &&
        "icon" in tech &&
        "name" in tech &&
        typeof tech.icon === "string" &&
        typeof tech.name === "string"
      );
    },
  },
});
</script>
