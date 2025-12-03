import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { Login } from './pages/Login'
import { Intranet } from './pages/Intranet'
import { NewProperty } from './pages/NewProperty'
import { PropertiesList } from './pages/PropertiesList'
import { LandingPage } from './pages/LandingPage'

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
    return <div style={{ padding: '50px', background: '#121212', color: '#fff' }}>Carregando sistema...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* --- ROTA PÚBLICA PRINCIPAL --- */}
        {/* Agora a raiz SEMPRE mostra a Landing Page, independente de estar logado */}
        <Route path="/" element={<LandingPage />} />

        {/* --- ROTA DE LOGIN --- */}
        {/* Se já estiver logado e tentar ir pro login, joga pra intranet. Se não, mostra login. */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/intranet" />} 
        />

        {/* --- ROTAS PROTEGIDAS (ADMINISTRATIVAS) --- */}
        {/* Só acessíveis digitando a URL manualmente ou por redirecionamento interno */}
        
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

        {/* Rota 404 */}
        <Route path="*" element={<h1 style={{color:'#fff', textAlign:'center'}}>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  )
}