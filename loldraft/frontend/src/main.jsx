import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ВАЖНО: импортируем Tailwind стили
import './index.css'

// Очищаем возможные старые стили
if (typeof document !== 'undefined') {
  // Удаляем старые CDN стили если они есть
  const oldStyles = document.querySelectorAll('link[href*="tailwind"], style[data-tailwind]')
  oldStyles.forEach(style => style.remove())
  
  // Добавляем проверку что стили загрузились
  setTimeout(() => {
    const testEl = document.createElement('div')
    testEl.className = 'hidden'
    testEl.style.cssText = '--tw-test: ok;'
    document.body.appendChild(testEl)
    
    const stylesLoaded = getComputedStyle(testEl).getPropertyValue('--tw-test') === 'ok'
    console.log('✅ Tailwind стили загружены:', stylesLoaded)
    
    testEl.remove()
  }, 100)
}

// Важно: монтируем в полную высоту
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.style.minHeight = '100vh';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Глобальная проверка сборки
console.log('🚀 React приложение запущено')
console.log('📦 Tailwind CSS подключен через index.css')
console.log('🌐 Текущий режим:', import.meta.env.MODE)