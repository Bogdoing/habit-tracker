<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

// Храним массив дат в localStorage
const dates = useStorage('dates', [])
</script>

<template>
    <table>
        <thead>
            <tr>
                <th>day</th>
                <th>time</th>
                <th>week</th>
                <th>count</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(date, index) in dates" :key="index">
                <td>
                    {{ date.day }} ({{ date.week }})
                </td>
                <td>{{ date.time.join(', ') }}</td>

                <td v-if="date.count < 4">{{ date.count }}🥳</td>
                <td v-else-if="date.count < 7">{{ date.count }}🤮</td>
                <td v-else>{{ date.count }}💀</td>
            </tr>
        </tbody>
    </table> 
</template>

<style>
table{
    margin-top: 10px;
}
</style>