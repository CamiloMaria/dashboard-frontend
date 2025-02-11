import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { Toaster } from '@/components/ui/toaster'
import './index.css'
import { ThemeProvider } from './components/ui/theme-provider'

// Wait for the router to be ready
await router.load()

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)

root.render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
