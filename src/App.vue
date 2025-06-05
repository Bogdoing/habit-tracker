<script setup>
import { ref } from 'vue'
import CalendarRow from './components/CalendarRow.vue'
import AppCounter from './components/AppCounter.vue'
import AppTable from './components/AppTable.vue'

const selectedDate = ref(null)

const handleDateSelect = (date) => {
    selectedDate.value = date
}
</script>

<template>
  <div class="app-container">
    <CalendarRow @select-date="handleDateSelect" />
    <AppCounter :selected-date="selectedDate" />
    <AppTable />
  </div>
</template>

<style scoped>
.app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
</style>
