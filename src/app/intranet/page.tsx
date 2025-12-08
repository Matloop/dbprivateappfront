'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, Users, Megaphone, Home as HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertiesList } from '@/components/admin/PropertiesList';
// import { Toaster } from 'sonner'; // Não precisa importar aqui se já está no layout.tsx

export default function IntranetPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('imoveis');
    const [loading, setLoading] = useState(true);

    // Como não temos mais a sessão do Supabase, usamos um estado local ou string fixa
    const [userEmail, setUserEmail] = useState('Administrador');

    useEffect(() => {
        // Verificação Simples de Token
        const token = localStorage.getItem('db_token');

        if (!token) {
            router.replace('/login');
        } else {
            // Opcional: Futuramente você pode chamar uma rota /auth/me para pegar o email real
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('db_token');
        router.replace('/login');
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-primary">Carregando acesso...</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans">

            {/* HEADER DA INTRANET */}
            <header className="bg-black border-b border-[#333] h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <span className="text-primary font-bold text-xl tracking-widest border-2 border-primary px-2 rounded">DB ADMIN</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* CORREÇÃO AQUI: Trocado session?.user?.email por userEmail */}
                    <span className="text-sm text-gray-400 hidden md:inline">Olá, <strong>{userEmail}</strong></span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="border-[#555] text-gray-300 hover:text-white hover:bg-[#333]"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Sair
                    </Button>
                </div>
            </header>

            {/* ABAS DE NAVEGAÇÃO */}
            <nav className="bg-[#1a1a1a] border-b border-[#333] px-6 pt-4 flex gap-1 overflow-x-auto">
                {[
                    { id: 'leads', label: 'Leads (CRM)', icon: Megaphone },
                    { id: 'clientes', label: 'Clientes', icon: Users },
                    { id: 'imoveis', label: 'Gestão de Imóveis', icon: HomeIcon },
                    { id: 'destaques', label: 'Destaques', icon: LayoutDashboard },
                ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-md transition-all
                ${isActive
                                    ? 'bg-[#333] text-primary border-t-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-[#222]'
                                }
              `}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.id === 'leads' && <span className="bg-red-600 text-white text-[10px] px-1.5 rounded-full ml-1">99+</span>}
                        </button>
                    )
                })}
            </nav>

            {/* ÁREA DE CONTEÚDO */}
            <main className="flex-1 p-6 overflow-hidden relative">

                {activeTab === 'imoveis' && (
                    <div className="h-full w-full">
                        {/* AQUI VAI ENTRAR A PropertiesList.tsx */}
                        {activeTab === 'imoveis' && (
                            <div className="h-full w-full overflow-y-auto pb-20">
                                <PropertiesList />
                            </div>
                        )}
                        <h2 className="text-2xl text-white mb-4">Lista de Imóveis (Em breve)</h2>
                        <p className="text-gray-400">Aqui vamos renderizar a tabela de gestão.</p>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Megaphone size={48} className="mb-4 opacity-20" />
                        <h2 className="text-xl">Módulo de Leads</h2>
                        <p>Em desenvolvimento...</p>
                    </div>
                )}

            </main>
        </div>
    );
}