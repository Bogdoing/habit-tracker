export const exportLocalStorageData = () => {
    // Получаем все данные из localStorage
    const allData = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      try {
        allData[key] = JSON.parse(localStorage.getItem(key))
      } catch {
        allData[key] = localStorage.getItem(key)
      }
    }
    
    // Создаем JSON строку
    const jsonString = JSON.stringify(allData, null, 2)
    
    // Создаем blob и ссылку для скачивания
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'habit-tracker-backup.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    return true
}