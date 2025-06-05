<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import advancedFormat from 'dayjs/plugin/advancedFormat'

// Подключаем плагины и локаль
dayjs.extend(advancedFormat)
dayjs.locale(ru)

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

function add() {
    const today = {
        day: dayjs().format('MM-DD-YYYY'),
        week: dayjs().format('dddd')
    }

    // Ищем, есть ли уже сегодняшняя дата в списке
    const existingDateIndex = dates.value.findIndex(d => d.day === today.day)

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
                day: today.day,
                week: today.week,
                time: [dayjs().format('HH:mm:ss')],
                count: 1
            }
        ]
    }
}

function minus() {
    // Берём сегодняшнюю дату
    const today = {
        day: dayjs().format('MM-DD-YYYY')
    }

    // Ищем индекс текущего дня в массиве
    const existingDateIndex = dates.value.findIndex(d => d.day === today.day)

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

            // Если время закончилось — можно удалить запись полностью (по желанию)
            // Но здесь мы просто оставляем пустой массив и count = 0
            // Либо можешь добавить условие: если count === 0 → удалить запись

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
    <h1 v-if="dates.length > 0">{{ dates[dates.length - 1].count}}</h1>
    <h1 v-else>0</h1>
    
    <button @click="minus">-</button>
    <button @click="add">+</button>
</template>

<style>
button{
    margin: 5px;
}
</style>