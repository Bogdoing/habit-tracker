<script setup>
</script>

<template>
  <div class="p-5 w-full bg-neutral-100 dark:bg-neutral-800 dark:text-white min-h-screen">
    <RouterLink to="/">Go to Home</RouterLink>
    <br>
    <RouterLink to="/stats">Go to stats</RouterLink>
    
    <router-view></router-view>
  </div>
</template>

<style scoped>
</style>
