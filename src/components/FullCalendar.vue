<script setup>
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useDateFormat, useNow } from '@vueuse/core'

// Текущая дата
const now = useNow()

// Хранилище данных
const dates = useStorage('dates', [])

// Определяем emit
const emit = defineEmits(['select-date'])

// Текущий месяц (хранится как объект Date)
const currentMonth = ref(new Date())

// Форматирование даты
function format(date, formatStr) {
    return useDateFormat(date, formatStr, { locales: 'ru-RU' }).value
}

// Получаем количество дней в месяце
function getDaysInMonth(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
}

// Добавление дней к дате
function addDays(date, days) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

// Получение дня недели (0=Вс, 1=Пн, ..., 6=Сб)
function getDay(date) {
    const day = date.getDay()
    return day === 0 ? 6 : day - 1 // делаем понедельник первым днём
}

// Вычисляем даты для текущего месяца
const monthDates = computed(() => {
    const today = currentMonth.value
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const datesArray = []

    // Дни предыдущего месяца, чтобы заполнить первую неделю
    const firstDayOfWeek = getDay(firstDayOfMonth)
    for (let i = firstDayOfWeek; i > 0; i--) {
        const date = addDays(firstDayOfMonth, -i)
        datesArray.push({
            day: useDateFormat(date, 'YYYY-MM-DD').value,
            week: useDateFormat(date, 'ddd', { locales: 'ru-RU' }).value,
            display: useDateFormat(date, 'D').value,
            isCurrentMonth: false
        })
    }

    // Дни текущего месяца
    const totalDays = getDaysInMonth(today)
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i)
        datesArray.push({
            day: useDateFormat(date, 'YYYY-MM-DD').value,
            week: useDateFormat(date, 'ddd', { locales: 'ru-RU' }).value,
            display: i,
            isCurrentMonth: true
        })
    }

    // Дни следующего месяца, чтобы заполнить последнюю неделю (всего должно быть 42 дня)
    const lastDayOfWeek = getDay(lastDayOfMonth)
    const remainingDays = 6 - lastDayOfWeek
    for (let i = 1; i <= remainingDays; i++) {
        const date = addDays(lastDayOfMonth, i)
        datesArray.push({
            day: useDateFormat(date, 'YYYY-MM-DD').value,
            week: useDateFormat(date, 'ddd', { locales: 'ru-RU' }).value,
            display: useDateFormat(date, 'D').value,
            isCurrentMonth: false
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
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}

const nextMonth = () => {
    currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}
</script>

<template>
    <div class="full-calendar">
        <div class="calendar-header">
            <button @click="prevMonth"><</button>
            <h2>{{ format(currentMonth, 'MMMM YYYY') }}</h2>
            <button @click="nextMonth">></button>
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
/* Стили те же самые — можно оставить без изменений */
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