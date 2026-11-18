import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

const HomePage = lazy(() => import('./pages/HomePage'))

function NotFound() {
  return (
    <div className="container-narrow py-32 text-center">
      <p className="font-pixel text-8xl text-ink-100 dark:text-ink-900 select-none">404</p>
      <p className="text-2xl font-pixel text-ink-600 dark:text-ink-400 -mt-8 mb-6">Page not found</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={
              <Suspense fallback={<LoadingSpinner />}><HomePage /></Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
