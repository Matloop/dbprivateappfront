import { Metadata } from 'next';
import { PropertyDetailsClient } from '@/components/PropertyDetailsClient';
import { api } from '@/lib/api';

// Força a página a ser dinâmica (não cacheada estaticamente) para ter dados sempre frescos
export const dynamic = 'force-dynamic';

// 1. Definição do Tipo para Next.js 15
type Props = {
    params: Promise<{ id: string }>;
};

// Interface para Tipagem (Resolve o erro do 'any')
interface PropertyData {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    bedrooms: number;
    garageSpots: number;
    address?: {
        city: string;
        neighborhood: string;
        street?: string;
        number?: string;
    };
    images: { url: string }[];
    // Adicione outros campos se necessário
}

// 2. GERAR META TAGS (SEO)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    
    try {
        // Tipamos o retorno da API
        const { data: property } = await api.get<PropertyData>(`/properties/${id}`);

        const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price);
        const imageUrl = property.images?.[0]?.url || 'https://dbprivate.com.br/placeholder.jpg';

        return {
            title: `${property.title} | DB Private`,
            description: `Confira este imóvel em ${property.address?.city}: ${property.bedrooms} quartos, ${property.garageSpots} vagas. Valor: ${priceFormatted}.`,
            openGraph: {
                title: property.title,
                description: `Oportunidade em ${property.address?.neighborhood}. ${priceFormatted}.`,
                images: [{ url: imageUrl, width: 1200, height: 630 }],
                type: 'website',
            },
        };
    } catch (error) {
        return { title: 'Imóvel não encontrado | DB Private' };
    }
}

// 3. CORPO DA PÁGINA (SERVER COMPONENT)
export default async function PropertyPage({ params }: Props) {
    const { id } = await params;

    let property: PropertyData | null = null;
    let similarProperties: PropertyData[] = [];

    try {
        // Busca Principal
        const { data } = await api.get<PropertyData>(`/properties/${id}`);
        property = data;

        // Busca Semelhantes
        if (property) {
            try {
                const { data: similar } = await api.get<PropertyData[]>(`/properties?city=${property.address?.city}&types=${property.category}`);
                // Filtra para não mostrar o próprio imóvel na lista de semelhantes
                similarProperties = similar.filter((p) => p.id !== property?.id);
            } catch (err) {
                console.error("Erro ao buscar semelhantes:", err);
            }
        }
    } catch (error) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-gray-400">
                <h1 className="text-2xl font-bold mb-4 text-white">Imóvel não encontrado</h1>
                <p>A referência #{id} pode ter sido removida ou não existe.</p>
            </div>
        );
    }

    // Passamos os dados para o componente Cliente (Onde o Mapa e o Carrossel vão ficar)
    return <PropertyDetailsClient property={property} similarProperties={similarProperties} />;
}