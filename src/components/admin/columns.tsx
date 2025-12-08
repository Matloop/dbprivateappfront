"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Tipo do dado
export type Property = {
  id: number
  title: string
  price: number
  status: string
  category: string
  images: { url: string }[]
  createdAt: string
}

export const columns: ColumnDef<Property>[] = [
  // 1. FOTO
  {
    accessorKey: "images",
    header: "Foto",
    cell: ({ row }) => {
      const img = row.original.images?.[0]?.url
      return (
        <div className="h-10 w-14 overflow-hidden rounded border border-[#333] bg-black">
          {img && <img src={img} alt="Thumb" className="h-full w-full object-cover" />}
        </div>
      )
    },
  },
  
  // 2. ID
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-[#333] hover:text-white"
        >
          Ref
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <span className="font-mono text-xs text-gray-500">#{row.getValue("id")}</span>,
  },

  // 3. TÍTULO
  {
    accessorKey: "title",
    header: "Imóvel",
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="truncate font-medium text-white">{row.getValue("title")}</span>
        <span className="text-xs text-gray-500">{row.original.category}</span>
      </div>
    ),
  },

  // 4. PREÇO
  {
    accessorKey: "price",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(price)
      return <div className="text-right font-medium text-primary">{formatted}</div>
    },
  },

  // 5. STATUS
  {
    accessorKey: "status",
    header: "Situação",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let colorClass = "bg-slate-500 text-white"
      if (status === "DISPONIVEL") colorClass = "bg-green-600/20 text-green-500 border-green-600/50"
      if (status === "VENDIDO") colorClass = "bg-red-600/20 text-red-500 border-red-600/50"
      if (status === "RESERVADO") colorClass = "bg-yellow-600/20 text-yellow-500 border-yellow-600/50"

      return <Badge className={`border ${colorClass} hover:${colorClass}`}>{status}</Badge>
    },
  },

  // 6. AÇÕES
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[#333] hover:text-white">
              <span className="sr-only">Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1e1e1e] border-[#333] text-gray-200">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(property.id.toString())} className="hover:bg-[#333] cursor-pointer">
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#333]" />
            
            <Link href={`/imovel/${property.id}`} target="_blank">
                <DropdownMenuItem className="hover:bg-[#333] cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> Ver no Site
                </DropdownMenuItem>
            </Link>
            
            <Link href={`/intranet/imovel/${property.id}`}>
                <DropdownMenuItem className="hover:bg-[#333] cursor-pointer">
                <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
            </Link>
            
            <DropdownMenuItem className="text-red-500 hover:bg-red-900/20 cursor-pointer focus:text-red-500">
              <Trash className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]