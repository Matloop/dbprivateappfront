import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { Login } from './pages/Login'
import { Intranet } from './pages/Intranet'
import { NewProperty } from './pages/NewProperty'
import { PropertiesList } from './pages/PropertiesList'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Importante para não piscar a tela errada

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

  // Mostra um "Carregando..." enquanto o Supabase verifica se o usuário existe
  if (loading) {
    return <div style={{ padding: '50px' }}>Carregando sistema...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Padrão: Se estiver logado vai pra intranet, senão login */}
        <Route 
          path="/" 
          element={session ? <Navigate to="/intranet" /> : <Navigate to="/login" />} 
        />

        {/* Rota de Login: Se já estiver logado, chuta pra intranet */}
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/intranet" />} 
        />

        {/* Rota Protegida (Intranet): Se NÃO estiver logado, chuta pro login */}
        <Route 
          path="/intranet" 
          element={session ? <Intranet session={session} /> : <Navigate to="/login" />} 
        />

        {/* Rota 404 - Caso o usuário digite algo errado */}
        <Route path="*" element={<h1>Página não encontrada</h1>} />
        <Route 
        path="/properties/new" 
        element={session ? <NewProperty /> : <Navigate to="/login" />} 
          />
        <Route path="/properties" element={<PropertiesList />} />

      </Routes>
    </BrowserRouter>
  )
}