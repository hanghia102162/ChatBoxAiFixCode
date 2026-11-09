<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea
    v-model="model"
    class="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
  />
</template>
