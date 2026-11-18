import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import LoadingSpinner from '../common/LoadingSpinner'
import Circuit from '../pixel/Circuit'
import GameHUD from '../../game/GameHUD'
import BootScreen from '../../game/BootScreen'

export default function Layout() {
  return (
    <div className="noise relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Circuit />
      <GameHUD />
      <BootScreen />
    </div>
  )
}
