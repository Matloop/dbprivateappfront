'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (authData.session) {
        localStorage.setItem('db_token', authData.session.access_token);
        toast.success('Bem-vindo de volta!');
        router.push('/intranet');
      } else {
        toast.error('Erro ao iniciar sessão.');
      }

    } catch (error: any) {
      console.error(error);
      const msg = error.message || 'Erro ao conectar com o servidor';
      if (msg.includes('Invalid login credentials')) {
        toast.error('E-mail ou senha incorretos.');
      } else {
        toast.error(`Falha no login: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-sans">
      <Card className="w-full max-w-sm bg-card border-border shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
             <img src="/logo2025.png" alt="DB Private" className="h-10 object-contain dark:invert-0 invert" />
          </div>
          <CardTitle className="text-2xl text-foreground font-light uppercase tracking-widest">
            Intranet
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesso administrativo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">E-mail</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="admin@dbprivate.com" 
                          {...field} 
                          className="pl-9 bg-background border-input text-foreground focus:border-primary placeholder:text-muted-foreground/50" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••" 
                          {...field} 
                          className="pl-9 bg-background border-input text-foreground focus:border-primary placeholder:text-muted-foreground/50" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider h-11"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Entrando...' : 'Acessar Sistema'}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}