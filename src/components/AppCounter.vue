<script setup>
import { ref, watch, computed } from 'vue'
import { useStorage } from '@vueuse/core'

// Русские названия дней недели
const ruWeekdays = {
  0: 'воскресенье',
  1: 'понедельник',
  2: 'вторник',
  3: 'среда',
  4: 'четверг',
  5: 'пятница',
  6: 'суббота'
}

// Получаем текущую дату в формате DD-MM-YYYY
function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

// Получаем день недели на русском
function getWeekday(date) {
  const d = new Date(date)
  return ruWeekdays[d.getDay()]
}

// Получаем пропс выбранной даты
const props = defineProps({
  selectedDate: {
    type: Object,
    default: null
  }
})

// Храним массив дат в localStorage
const dates = useStorage('dates', [
  {
    day: '06-04-2025',
    week: 'среда',
    time: [],
    count: 7
  },
  {
    day: '06-03-2025',
    week: 'вторник',
    time: [],
    count: 15
  }
])

// Вычисляемое свойство для текущего count
const currentCount = computed(() => {
  if (!props.selectedDate) {
    const today = formatDate(new Date())
    const todayEntry = dates.value.find(d => d.day === today)
    return todayEntry ? todayEntry.count : 0
  }

  const selectedEntry = dates.value.find(d => d.day === props.selectedDate.day)
  return selectedEntry ? selectedEntry.count : 0
})

// Форматируем текущее время как HH:mm:ss
function formatTime(date) {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function add() {
  const now = new Date()
  const targetDate = props.selectedDate ? props.selectedDate.day : formatDate(now)
  const targetWeek = props.selectedDate ? props.selectedDate.week : getWeekday(now)

  const existingDateIndex = dates.value.findIndex(d => d.day === targetDate)

  if (existingDateIndex > -1) {
    const updatedEntry = {
      ...dates.value[existingDateIndex],
      time: [...dates.value[existingDateIndex].time, formatTime(now)],
      count: dates.value[existingDateIndex].count + 1
    }

    dates.value = [
      ...dates.value.slice(0, existingDateIndex),
      updatedEntry,
      ...dates.value.slice(existingDateIndex + 1)
    ]
  } else {
    dates.value = [
      ...dates.value,
      {
        day: targetDate,
        week: targetWeek,
        time: [formatTime(now)],
        count: 1
      }
    ]
  }
}

function minus() {
  const targetDate = props.selectedDate ? props.selectedDate.day : formatDate(new Date())

  const existingDateIndex = dates.value.findIndex(d => d.day === targetDate)

  if (existingDateIndex > -1) {
    const currentEntry = dates.value[existingDateIndex]

    if (currentEntry.count > 0) {
      const updatedEntry = {
        ...currentEntry,
        time: currentEntry.time.slice(0, -1),
        count: currentEntry.count - 1
      }

      dates.value = [
        ...dates.value.slice(0, existingDateIndex),
        updatedEntry,
        ...dates.value.slice(existingDateIndex + 1)
      ]
    }
  }
}
</script>

<template>
  <div class="counter-container">
    <h1 class="text-8xl p-5">{{ currentCount }}</h1>
    <div class="my-10">
      <button
        @click="minus"
        class="bg-gray-200 border-2 border-transparent rounded-md hover:border-2 hover:border-sky-500
                dark:bg-neutral-600 dark:text-neutral-200 dark:hover:border-sky-600"
      >
        -
      </button>
      <button
        @click="add"
        class="bg-gray-200 border-2 border-transparent rounded-md hover:border-2 hover:border-sky-500
                dark:bg-neutral-600 dark:text-neutral-200 dark:hover:border-sky-600"
      >
        +
      </button>
    </div>
    <div v-if="selectedDate" class="">
      Выбрана дата: {{ selectedDate.display }} {{ selectedDate.week }}
    </div>
  </div>
</template>

<style scoped>
.counter-container {
  text-align: center;
}

button {
  margin: 5px;
  padding: 8px 16px;
  font-size: 1.2em;
  cursor: pointer;
}
</style>