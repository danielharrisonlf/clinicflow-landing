import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './index.css'
import { App } from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento #root ausente no index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
