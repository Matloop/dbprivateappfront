import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // <--- IMPORTANTE
import { Toaster } from 'sonner' // <--- Notificações bonitas

// Layouts e Componentes
import { MainLayout } from './layouts/MainLayout'
import { ScrollToTop } from './components/ScrollToTop'

// Páginas Públicas
import { LandingPage } from './pages/LandingPage/LandingPage'
import { SalesPage } from './pages/SalesPage'
import { Login } from './pages/Login'

// Páginas Privadas
import { Intranet } from './pages/Intranet'
import { NewProperty } from './pages/NewProperty'
import { PropertiesList } from './pages/PropertiesList'
import { PropertyDetails } from './pages/PropertyDetails'
import { About } from './pages/About'
import { FavoritesPage } from './pages/FavoritesPage'

// 1. CRIAR O CLIENTE DO REACT QUERY (FORA DO COMPONENTE)
const queryClient = new QueryClient()

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background text-primary">Carregando sistema...</div>
  }

  return (
    // 2. ENVOLVER TUDO COM O PROVIDER
    <QueryClientProvider client={queryClient}>
      
      <BrowserRouter>
        <ScrollToTop />
        
        <Routes>
          {/* =========================================
              ÁREA PÚBLICA
             ========================================= */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/imovel/:id" element={<PropertyDetails />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/favoritos" element={<FavoritesPage />} /> 
            <Route path="/vendas" element={<SalesPage />} />
          </Route>

          {/* =========================================
              LOGIN
             ========================================= */}
          <Route 
            path="/login" 
            element={!session ? <Login /> : <Navigate to="/intranet" />} 
          />

          {/* =========================================
              ÁREA PRIVADA
             ========================================= */}
          <Route 
            path="/intranet" 
            element={session ? <Intranet session={session} /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/properties" 
            element={session ? <PropertiesList /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/properties/new" 
            element={session ? <NewProperty /> : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/properties/edit/:id" 
            element={session ? <NewProperty /> : <Navigate to="/login" />} 
          />

          {/* 404 */}
          <Route path="*" element={<div className="h-screen flex flex-col items-center justify-center bg-background text-foreground"><h1>404 - Página não encontrada</h1><a href="/" className="text-primary mt-4">Voltar para Home</a></div>} />
        </Routes>
      </BrowserRouter>

      {/* 3. COMPONENTE DE NOTIFICAÇÕES (Fica aqui fora pra aparecer em cima de tudo) */}
      <Toaster theme="dark" position="top-right" />
      
    </QueryClientProvider>
  )
}