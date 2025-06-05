<template>
  <div class="calendar-row">
    <div v-for="day in weekDates" :key="day.date" class="day-cell">
      <div class="day">{{ day.dateObj.getDate() }}</div>
      <input
        type="number"
        v-model.number="day.value"
        placeholder="0"
        min="0"
        class="value-input"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'


</script>

<style scoped>

</style>