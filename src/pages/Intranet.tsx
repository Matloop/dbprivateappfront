import { supabase } from '../supabaseClient'

// Recebemos a sessão como propriedade
export function Intranet({ session }: { session: any }) {
  return (
    <div style={{ padding: '50px' }}>
      <h1>🏠 Intranet</h1>
      <p>Bem-vindo, <strong>{session.user.email}</strong></p>
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#e0f7fa' }}>
        <h3>Painel de Controle</h3>
        <p>Aqui você vai colocar os componentes que chamam seu NestJS.</p>
      </div>
      <button onClick={() => window.location.href='/properties/new'}>
      + Novo Imóvel
      </button>
      <button onClick={() => window.location.href='/properties/'}>
      mostrar Imóvel
      </button>
      <button 
        style={{ marginTop: '20px' }}
        onClick={() => supabase.auth.signOut()}
      >
        Sair do Sistema
      </button>
    </div>
  )
}