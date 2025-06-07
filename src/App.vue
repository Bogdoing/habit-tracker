<script setup>
import { ref } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core'
import CalendarRow from './components/CalendarRow.vue'
import FullCalendar from './components/FullCalendar.vue'
import AppCounter from './components/AppCounter.vue'
import AppTable from './components/AppTable.vue'

// default value day 
const selectedDate = ref({
  day: useDateFormat(useNow(), 'YYYY-MM-DD', { locales: 'ru-RU' }),
  week: useDateFormat(useNow(), 'ddd', { locales: 'ru-RU' }),
  display: useDateFormat(useNow(), 'D', { locales: 'ru-RU' })
})

const showFullCalendar = ref(false)

const handleDateSelect = (date) => {
    selectedDate.value = date
}

const toggleCalendar = () => {
    showFullCalendar.value = !showFullCalendar.value
}
</script>

<template>
  <div class="app-container p-5">
    <div class="mb-10">
      <button class="toggle-calendar" @click="toggleCalendar">
        {{ showFullCalendar ? 'Показать маленький календарь' : 'Показать полный календарь' }}
      </button>
      
      <CalendarRow v-if="!showFullCalendar" @select-date="handleDateSelect" />
      <FullCalendar v-else @select-date="handleDateSelect" />
    </div>
    
    <AppCounter :selected-date="selectedDate" />
    <AppTable />
  </div>
</template>

<style scoped>
.app-container {
    max-width: 1200px;
    margin: 0 auto;
}


.toggle-calendar {
    margin-bottom: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

.toggle-calendar:hover {
    background-color: #45a049;
}
</style>
