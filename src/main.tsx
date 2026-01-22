// 1️⃣ Inject Buffer polyfill at the very top
import { Buffer } from 'buffer'

// Extend Window interface to include Buffer
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

window.Buffer = Buffer

// 2️⃣ React imports
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 3️⃣ Styles and App
import './index.css'
import App from './App.tsx'

// 4️⃣ Mount React
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
