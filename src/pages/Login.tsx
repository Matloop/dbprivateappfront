import { supabase } from '../supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ width: '400px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#1e1e1e' }}>
        <h2 style={{ textAlign: 'center', color: '#fff' }}>Acesse a Intranet</h2>
        
        <Auth 
          supabaseClient={supabase}
          // Define que a tela é apenas de Login
          view="sign_in"
          
          // Remove os links de "Cadastrar" e "Esqueci a senha" do rodapé
          showLinks={false}
          
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#909212ff', // Cor verde do botão (exemplo)
                  brandAccent: '#909212ff',
                }
              }
            },
          }}
          
          providers={[]} 
          
          // TRADUÇÃO PARA PORTUGUÊS
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                email_input_placeholder: 'Seu e-mail ',
                password_input_placeholder: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
              },
            },
          }}
        />
      </div>
    </div>
  )
}