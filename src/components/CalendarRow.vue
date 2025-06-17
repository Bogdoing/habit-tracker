<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useDateFormat, useNow } from '@vueuse/core'
import { usePreferredDark } from '@vueuse/core'

// Текущее время
const now = useNow()

// Получаем данные из localStorage
const dates = useStorage('dates', [])

// Определяем emit
const emit = defineEmits(['select-date'])

// Вспомогательная функция для добавления дней к дате
function addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// Вычисляем даты для текущей недели
const weekDates = computed(() => {
    const today = now.value
    const datesArray = []

    for (let i = -4; i <= 0; i++) {
        const date = addDays(today, i)

        const day = useDateFormat(date, 'YYYY-MM-DD').value
        const week = useDateFormat(date, 'ddd', { locales: 'ru-RU' }).value
        const display = useDateFormat(date, 'D').value

        datesArray.push({
            day,
            week,
            display
        })
    }

    return datesArray
})

// Функция для получения count для конкретной даты
const getCountForDate = (day) => {
    const dateEntry = dates.value.find(d => d.day === day)
    return dateEntry ? dateEntry.count : 0
}

// Функция для определения цвета фона в зависимости от count
const getBackgroundColor = (count) => {
    const isDark = usePreferredDark()
    if (isDark.value == true) {
        if (count === 0) return '#525252'
        if (count >= 1 && count < 3) return '#58dd56'
        if (count >= 3 && count < 6) return '#edb936'
        if (count >= 6 && count < 10) return '#e54242'
        return '#890000'
    }
    else {
        if (count === 0) return '#ffffff'
        if (count >= 1 && count < 3) return '#58dd56'
        if (count >= 3 && count < 6) return '#edb936'
        if (count >= 6 && count < 10) return '#e54242'
        return '#ce0202'
    }
}

// Обработчик клика по дате
const handleDateClick = (date) => {
    emit('select-date', date)
}
</script>

<template>
    <div class="calendar-row">
        <div 
            v-for="date in weekDates" 
            :key="date.day"
            class="calendar-day dark:text-neutral-100"
            :style="{ backgroundColor: getBackgroundColor(getCountForDate(date.day)) }"
            @click="handleDateClick(date)"
        >
            <div class="day-number dark:text-neutral-100">{{ date.display }}</div>
            <div class="day-name text-[#666666] dark:text-neutral-100">{{ date.week }} </div>
        </div>
    </div>
</template>

<style scoped>
.calendar-row {
    display: flex;
    justify-content: space-between;
    gap: 5px;
}

.calendar-day {
    flex: 1;
    padding: 10px 5px;
    border: 1px solid #ddd;
    border-radius: 10px;
    text-align: center;
    transition: background-color 0.3s ease;
    cursor: pointer;
}

.calendar-day:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.day-number {
    font-size: 1.2em;
    font-weight: bold;
}

.day-name {
    font-size: 0.8em;
}
</style>