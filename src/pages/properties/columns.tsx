import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Definição do tipo de dado (igual ao que vem da API)
export type Property = {
  id: number;
  title: string;
  price: number;
  status: string;
  category: string;
  bedrooms: number;
  garageSpots: number;
  privateArea: number;
  images: { url: string }[];
  createdAt: string;
};

export const columns: ColumnDef<Property>[] = [
  // 1. FOTO (Miniatura)
  {
    accessorKey: "images",
    header: "Foto",
    cell: ({ row }) => {
      const img = row.original.images?.[0]?.url;
      return (
        <div className="h-12 w-16 overflow-hidden rounded-md border border-muted bg-muted">
          {img ? (
            <img src={img} alt="Thumb" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Sem foto</div>
          )}
        </div>
      );
    },
  },
  
  // 2. ID (Com ordenação)
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ref
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue("id")}</span>,
  },

  // 3. TÍTULO E CATEGORIA
  {
    accessorKey: "title",
    header: "Imóvel",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="truncate font-medium">{row.getValue("title")}</span>
        <span className="text-xs text-muted-foreground">{row.original.category}</span>
      </div>
    ),
  },

  // 4. PREÇO (Formatado)
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(price);
      return <div className="text-right font-bold text-primary">{formatted}</div>;
    },
  },

  // 5. STATUS (Badge Colorido)
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let colorClass = "bg-slate-500";
      if (status === "DISPONIVEL") colorClass = "bg-green-600 hover:bg-green-700";
      if (status === "VENDIDO") colorClass = "bg-red-600 hover:bg-red-700";
      if (status === "RESERVADO") colorClass = "bg-yellow-600 hover:bg-yellow-700";

      return <Badge className={colorClass}>{status}</Badge>;
    },
  },

  // 6. AÇÕES (Menu Dropdown)
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
      // Hook de navegação não funciona direto aqui, usamos window ou passamos via meta
      // Mas para simplificar, vamos usar um componente wrapper ou link direto
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(property.id.toString())}>
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/properties/edit/${property.id}`}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];