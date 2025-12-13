"use client";

import { useSearchParams } from "next/navigation";
import { useProperties } from "@/hooks/useProperties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { SidebarFilter } from "@/components/sales/SidebarFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/sales/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SalesPageClient() {
  const searchParams = useSearchParams();

  const filters = {
    city: searchParams.get("city") || undefined,
    neighborhood: searchParams.get("neighborhood") || undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    minArea: searchParams.get("minArea") || undefined,
    maxArea: searchParams.get("maxArea") || undefined,
    garageSpots: searchParams.get("garageSpots")
      ? Number(searchParams.get("garageSpots"))
      : undefined,

    bedrooms: searchParams.get("bedrooms")
      ? Number(searchParams.get("bedrooms"))
      : undefined,

    suites: searchParams.get("suites")
      ? Number(searchParams.get("suites"))
      : undefined,
    stage: searchParams.get("stage") || undefined,
    types: searchParams.getAll("types"),
    negotiation: searchParams.getAll("negotiation"),
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useProperties(filters);

  const allProperties = data?.pages.flatMap((page) => page.data) || [];
  const totalItems = data?.pages[0]?.meta.total || 0;

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Vendas", path: "/vendas" },
  ];

  return (
    // ANTES: bg-background (Já estava correto, mantido)
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      {/* ANTES: bg-card/50 */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={breadcrumbItems}
            className="bg-transparent border-none p-0 shadow-none"
          />
          <h1 className="text-3xl font-light text-primary mt-4">
            Imóveis à Venda
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Buscando imóveis..."
              : `${totalItems} imóveis encontrados`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <SidebarFilter />

        {/* Lista de Imóveis */}
        <div className="flex-1">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-xl bg-muted/20" />
                  <Skeleton className="h-4 w-[250px] bg-muted/20" />
                  <Skeleton className="h-4 w-[150px] bg-muted/20" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="w-full py-20 text-center border border-destructive/20 bg-destructive/10 rounded-lg text-destructive">
              Erro ao carregar imóveis. Verifique sua conexão.
            </div>
          )}

          {!isLoading && allProperties.length === 0 && (
            <div className="w-full py-20 text-center border border-border bg-card rounded-lg">
              <p className="text-lg text-muted-foreground">
                Nenhum imóvel encontrado.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Tente ajustar seus filtros.
              </p>
            </div>
          )}

          {allProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {allProperties.map((prop: any) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="mt-10 flex justify-center">
              {/* ANTES: bg-[#1a1a1a] border-[#333] text-white */}
              {/* DEPOIS: bg-card border-input text-foreground hover:bg-muted */}
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-card border border-input hover:bg-muted text-foreground min-w-[200px]"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Carregando...
                  </>
                ) : (
                  "Carregar Mais Imóveis"
                )}
              </Button>
            </div>
          )}

          {!hasNextPage && allProperties.length > 0 && (
            <p className="text-center text-muted-foreground text-sm mt-10">
              Você chegou ao fim da lista.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
