import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'
import TopHeader from './components/layout/TopHeader'
import Footer from './components/layout/Footer'
import MobileNavComponent from './components/layout/MobileNav'
import ProfileSidebar from './components/layout/ProfileSidebar'
import SearchOverlay from './components/layout/SearchOverlay'
import { ToastProvider } from './context/ToastContext'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const theme = useSelector((state) => state.theme.mode)
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const isAuth = ['/login', '/signup'].includes(location.pathname)
  const isProfileSide = location.pathname.startsWith('/profile')
  const hideFooter = location.pathname.startsWith('/profile')

  return (
    <ToastProvider>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col">
        <TopHeader />
        <Navbar />

        <div className={`flex flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-6 ${isProfileSide ? 'lg:px-8 gap-10' : ''}`}>
          {isProfileSide && <ProfileSidebar />}
          <main className="flex-1 min-w-0">
            <AppRoutes />
          </main>
        </div>

        {!isAuth && !hideFooter && <Footer />}
        <MobileNavComponent />
        <SearchOverlay />
      </div>
    </ToastProvider>
  )
}

export default App