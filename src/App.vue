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
  <div class="p-5 w-full bg-white dark:bg-neutral-800 dark:text-white">
    <div class="mb-10 text-center">
      <button @click="toggleCalendar" 
      class="mb-4 px-2 py-4 bg-green-200 rounded-md dark:bg-green-500">
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
</style>
