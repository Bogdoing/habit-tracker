<script setup>
import { ref, watch, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Подключаем плагины и локаль
dayjs.extend(advancedFormat)
dayjs.locale(ru)

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
        // Если дата не выбрана, показываем count для сегодняшнего дня
        const today = dayjs().format('DD-MM-YYYY')
        const todayEntry = dates.value.find(d => d.day === today)
        return todayEntry ? todayEntry.count : 0
    }
    
    // Если дата выбрана, показываем count для выбранной даты
    const selectedEntry = dates.value.find(d => d.day === props.selectedDate.day)
    return selectedEntry ? selectedEntry.count : 0
})

function add() {
    const targetDate = props.selectedDate ? props.selectedDate.day : dayjs().format('DD-MM-YYYY')
    const targetWeek = props.selectedDate ? props.selectedDate.week : dayjs().format('dddd')

    // Ищем, есть ли уже эта дата в списке
    const existingDateIndex = dates.value.findIndex(d => d.day === targetDate)

    if (existingDateIndex > -1) {
        // Если нашли — обновляем существующую запись
        const updatedEntry = {
            ...dates.value[existingDateIndex],
            time: [...dates.value[existingDateIndex].time, dayjs().format('HH:mm:ss')],
            count: dates.value[existingDateIndex].count + 1
        }

        // Заменяем старый объект на обновленный
        dates.value = [
            ...dates.value.slice(0, existingDateIndex),
            updatedEntry,
            ...dates.value.slice(existingDateIndex + 1)
        ]
    } else {
        // Если не нашли — добавляем новую запись
        dates.value = [
            ...dates.value,
            {
                day: targetDate,
                week: targetWeek,
                time: [dayjs().format('HH:mm:ss')],
                count: 1
            }
        ]
    }
}

function minus() {
    const targetDate = props.selectedDate ? props.selectedDate.day : dayjs().format('DD-MM-YYYY')

    // Ищем индекс текущего дня в массиве
    const existingDateIndex = dates.value.findIndex(d => d.day === targetDate)

    if (existingDateIndex > -1) {
        const currentEntry = dates.value[existingDateIndex]

        // Проверяем, есть ли что уменьшать
        if (currentEntry.count > 0) {
            // Создаём новый объект с обновлёнными данными
            const updatedEntry = {
                ...currentEntry,
                time: currentEntry.time.slice(0, -1), // убираем последний элемент времени
                count: currentEntry.count - 1
            }

            // Обновляем массив
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
            <button @click="minus"
                class="bg-gray-200 border-2 border-transparent rounded-md hover:border-2 hover:border-sky-500">
                -
            </button>
            <button @click="add"
                class="bg-gray-200 border-2 border-transparent rounded-md hover:border-2 hover:border-sky-500">
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