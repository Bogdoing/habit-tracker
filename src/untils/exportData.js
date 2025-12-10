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

export const importLocalStorageData = () => {
  return new Promise((resolve, reject) => {
    // Создаем input для выбора файла
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = (event) => {
      const file = event.target.files[0]
      if (!file) {
        reject(new Error('Файл не выбран'))
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          
          // Очищаем текущий localStorage
          localStorage.clear()
          
          // Загружаем данные из файла
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object') {
              localStorage.setItem(key, JSON.stringify(value))
            } else {
              localStorage.setItem(key, value)
            }
          }
          
          resolve('Данные успешно импортированы')
        } catch (error) {
          reject(new Error('Ошибка при чтении файла: ' + error.message))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'))
      }
      
      reader.readAsText(file)
    }
    
    input.click()
  })
}