<script setup>
import { ref } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core'
import CalendarRow from './components/CalendarRow.vue'
import FullCalendar from './components/FullCalendar.vue'
import AppCounter from './components/AppCounter.vue'
import AppTable from './components/AppTable.vue'
import { exportLocalStorageData, importLocalStorageData } from './untils/exportData.js'

// default value day 
const selectedDate = ref({
  day: useDateFormat(useNow(), 'YYYY-MM-DD', { locales: 'ru-RU' }),
  week: useDateFormat(useNow(), 'ddd', { locales: 'ru-RU' }),
  display: useDateFormat(useNow(), 'D', { locales: 'ru-RU' })
})

const showFullCalendar = ref(false)
const showAppTable = ref()

function onShowAppTable() {
  showAppTable.value = !showAppTable.value
}

const handleDateSelect = (date) => {
    selectedDate.value = date
}

const toggleCalendar = () => {
    showFullCalendar.value = !showFullCalendar.value
}

// Функция для скачивания данных
const downloadLocalStorageData = () => {
  exportLocalStorageData()
}

// Функция для загрузки данных
const uploadLocalStorageData = async () => {
  try {
    const message = await importLocalStorageData()
    alert(message)
    // Перезагружаем страницу для применения изменений
    window.location.reload()
  } catch (error) {
    alert('Ошибка: ' + error.message)
  }
}
</script>

<template>
  <div class="p-5 w-full bg-neutral-100 dark:bg-neutral-800 dark:text-white min-h-screen">
    <div class="mb-10 text-center">
      <button @click="toggleCalendar" 
      class="mb-4 px-2 py-4 bg-neutral-200 rounded-md dark:bg-neutral-700">
        {{ showFullCalendar ? 'Показать маленький календарь' : 'Показать полный календарь' }}
      </button>
      
      <!-- Кнопки для экспорта и импорта -->
      <button @click="downloadLocalStorageData" 
              class="mb-4 ml-2 px-2 py-4 bg-green-200 rounded-md dark:bg-green-700">
        Скачать данные
      </button>
      
      <button @click="uploadLocalStorageData" 
              class="mb-4 ml-2 px-2 py-4 bg-blue-200 rounded-md dark:bg-blue-700">
        Загрузить данные
      </button>
      
      <CalendarRow v-if="!showFullCalendar" @select-date="handleDateSelect" />
      <FullCalendar v-else @select-date="handleDateSelect" />
    </div>
    
    <AppCounter :selected-date="selectedDate" />

    <div class="w-full text-center">
      <button @click="onShowAppTable" class="my-10">
        Показать/Скрыть таблицу
      </button>
      <AppTable v-if="showAppTable"/>
    </div>
  </div>
</template>

<style scoped>
</style>
