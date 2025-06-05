<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Подключаем плагины и локаль
dayjs.extend(advancedFormat)
dayjs.locale(ru)

// Получаем данные из localStorage
const dates = useStorage('dates', [])

// Определяем emit
const emit = defineEmits(['select-date'])

// Текущий месяц
const currentMonth = ref(dayjs())

// Вычисляем даты для текущего месяца
const monthDates = computed(() => {
    const start = currentMonth.value.startOf('month')
    const end = currentMonth.value.endOf('month')
    const dates = []
    
    // Добавляем дни предыдущего месяца для заполнения первой недели
    const firstDayOfWeek = start.day()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = start.subtract(i + 1, 'day')
        dates.push({
            day: date.format('DD-MM-YYYY'),
            week: date.format('dddd'),
            display: date.format('D'),
            isCurrentMonth: false
        })
    }
    
    // Добавляем дни текущего месяца
    for (let i = 0; i < end.date(); i++) {
        const date = start.add(i, 'day')
        dates.push({
            day: date.format('DD-MM-YYYY'),
            week: date.format('dddd'),
            display: date.format('D'),
            isCurrentMonth: true
        })
    }
    
    // Добавляем дни следующего месяца для заполнения последней недели
    const lastDayOfWeek = end.day()
    for (let i = 1; i <= 7 - lastDayOfWeek; i++) {
        const date = end.add(i, 'day')
        dates.push({
            day: date.format('DD-MM-YYYY'),
            week: date.format('dddd'),
            display: date.format('D'),
            isCurrentMonth: false
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

// Обработчик клика по дате
const handleDateClick = (date) => {
    emit('select-date', date)
}

// Переключение месяцев
const prevMonth = () => {
    currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const nextMonth = () => {
    currentMonth.value = currentMonth.value.add(1, 'month')
}
</script>

<template>
    <div class="full-calendar">
        <div class="calendar-header">
            <button @click="prevMonth">&lt;</button>
            <h2>{{ currentMonth.format('MMMM YYYY') }}</h2>
            <button @click="nextMonth">&gt;</button>
        </div>
        
        <div class="weekdays">
            <div v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']" :key="day" class="weekday">
                {{ day }}
            </div>
        </div>
        
        <div class="calendar-grid">
            <div 
                v-for="date in monthDates" 
                :key="date.day"
                class="calendar-day"
                :class="{ 'other-month': !date.isCurrentMonth }"
                :style="{ backgroundColor: getBackgroundColor(getCountForDate(date.day)) }"
                @click="handleDateClick(date)"
            >
                <div class="day-number">{{ date.display }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.full-calendar {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.calendar-header button {
    padding: 8px 16px;
    border: none;
    background: #f5f5f5;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2em;
}

.calendar-header button:hover {
    background: #e0e0e0;
}

.calendar-header h2 {
    margin: 0;
    text-transform: capitalize;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 10px;
}

.weekday {
    text-align: center;
    font-weight: bold;
    color: #666;
    padding: 5px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day {
    aspect-ratio: 1;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-day:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.calendar-day.other-month {
    opacity: 0.5;
}

.day-number {
    font-size: 1.1em;
    font-weight: bold;
}
</style> 