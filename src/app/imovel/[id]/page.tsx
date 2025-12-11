import { Metadata } from 'next';
import { PropertyDetailsClient } from '@/components/property/PropertyDetailsClient';
import { api } from '@/lib/api';

// Força a página a ser dinâmica
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>;
};

// Interface para Tipagem
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
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    
    try {
        const { data: property } = await api.get<PropertyData>(`/properties/${id}`);
        const priceFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price);
        const imageUrl = property.images?.[0]?.url || 'https://dbprivate.com.br/placeholder.jpg';

        return {
            title: `${property.title} | DB Private`,
            description: `Confira este imóvel em ${property.address?.city}. ${priceFormatted}.`,
            openGraph: {
                title: property.title,
                images: [{ url: imageUrl, width: 1200, height: 630 }],
            },
        };
    } catch (error) {
        return { title: 'Imóvel não encontrado | DB Private' };
    }
}

export default async function PropertyPage({ params }: Props) {
    const { id } = await params;

    let property: PropertyData | null = null;
    let similarProperties: PropertyData[] = [];

    try {
        // 1. Busca Principal (findOne retorna o objeto direto do imóvel)
        const { data } = await api.get<PropertyData>(`/properties/${id}`);
        property = data;

        // 2. Busca Semelhantes
        if (property) {
            try {
                console.log(`🔍 Buscando semelhantes para ID ${id} em ${property.address?.city} / ${property.category}...`);
                
                // Note o "limit=10" para não trazer muita coisa
                const { data: responseBody } = await api.get<any>(
                    `/properties?city=${encodeURIComponent(property.address?.city || '')}&types=${property.category}&limit=10`
                );

                // DEBUG: Verifique no seu terminal o que aparece aqui
                // console.log("Resposta da API Semelhantes:", JSON.stringify(responseBody?.meta, null, 2));

                // Adaptação para Paginação: O array de imóveis está dentro de .data
                const list = responseBody?.data || [];
                
                if (Array.isArray(list)) {
                    // Filtra para não mostrar o próprio imóvel que estamos vendo
                    similarProperties = list.filter((p: PropertyData) => p.id !== property?.id);
                }
                
                console.log(`✅ Encontrados ${similarProperties.length} imóveis semelhantes.`);

            } catch (err) {
                console.error("❌ Erro ao buscar semelhantes:", err);
            }
        }
    } catch (error) {
        console.error("❌ Erro ao buscar imóvel principal:", error);
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-gray-400">
                <h1 className="text-2xl font-bold mb-4 text-white">Imóvel não encontrado</h1>
                <p>A referência #{id} pode ter sido removida ou não existe.</p>
            </div>
        );
    }

    // Renderiza o Cliente
    return <PropertyDetailsClient property={property} similarProperties={similarProperties} />;
}