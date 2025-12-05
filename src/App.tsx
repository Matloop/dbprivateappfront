import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

// Layouts
import { MainLayout } from './layouts/MainLayout'

// Páginas Públicas
import { LandingPage } from './pages/LandingPage/LandingPage'
import { SalesPage } from './pages/SalesPage'
import { Login } from './pages/Login'

// Páginas Privadas (Intranet)
import { Intranet } from './pages/Intranet'
import { NewProperty } from './pages/NewProperty'
import { PropertiesList } from './pages/PropertiesList' // Caso use rota separada
import { PropertyDetails } from './pages/PropertyDetails'
import { About } from './pages/About'
import { FavoritesPage } from './pages/FavoritesPage'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Checa sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Ouve mudanças (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ height: '100vh', background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>Carregando sistema...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================
            ÁREA PÚBLICA (Com Navbar e Footer)
           ========================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/imovel/:id" element={<PropertyDetails />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/favoritos" element={<FavoritesPage />} /> 
        </Route>

        {/* =========================================
            LOGIN
           ========================================= */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/intranet" />} 
        />

        {/* =========================================
            ÁREA PRIVADA (Sem Navbar do Site)
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
        <Route path="/vendas" element={<SalesPage />} />
        {/* =========================================
            404 - Página Não Encontrada
           ========================================= */}
        <Route path="*" element={<div style={{padding: 50, color:'#fff', textAlign:'center', background: '#121212', height: '100vh'}}><h1>404 - Página não encontrada</h1><a href="/" style={{color: '#d4af37'}}>Voltar para Home</a></div>} />
      </Routes>
    </BrowserRouter>
  )
}