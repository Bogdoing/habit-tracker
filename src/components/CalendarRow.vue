<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Подключаем плагины и локаль
dayjs.extend(advancedFormat)
dayjs.locale(ru)

// Получаем данные из localStorage
const dates = useStorage('dates', [])

// Вычисляем даты для текущей недели
const weekDates = computed(() => {
    const today = dayjs()
    const dates = []
    
    // Генерируем 7 дней, начиная с 4 дней назад
    for (let i = -4; i <= 2; i++) {
        const date = today.add(i, 'day')
        dates.push({
            day: date.format('MM-DD-YYYY'),
            week: date.format('dddd'),
            display: date.format('D')
        })
    }
    
    return dates
})

// Функция для получения count для конкретной даты
const getCountForDate = (day) => {
    const dateEntry = dates.value.find(d => d.day === day)
    return dateEntry ? dateEntry.count : 0
}

// Функция для определения цвета фона в зависимости от count
const getBackgroundColor = (count) => {
    if (count === 0) return '#ffffff'
    if (count <= 5) return '#ffebee'
    if (count <= 10) return '#ffcdd2'
    if (count <= 15) return '#ef9a9a'
    return '#e57373'
}
</script>

<template>
    <div class="calendar-row">
        <div 
            v-for="date in weekDates" 
            :key="date.day"
            class="calendar-day"
            :style="{ backgroundColor: getBackgroundColor(getCountForDate(date.day)) }"
        >
            <div class="day-number">{{ date.display }}</div>
            <div class="day-name">{{ date.week }}</div>
        </div>
    </div>
</template>

<style scoped>
.calendar-row {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    gap: 10px;
}

.calendar-day {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    text-align: center;
    transition: background-color 0.3s ease;
}

.day-number {
    font-size: 1.2em;
    font-weight: bold;
}

.day-name {
    font-size: 0.8em;
    color: #666;
}
</style>