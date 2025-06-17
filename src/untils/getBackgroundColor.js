// Функция для определения цвета фона в зависимости от count
export const getBackgroundColor = (count) => {
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