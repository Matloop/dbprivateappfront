import { z } from "zod";

export const propertySchema = z.object({
  // IDENTIFICAÇÃO
  title: z.string().min(5, "O título é muito curto").max(100),
  oldRef: z.string().optional(),
  category: z.string().min(1, "Selecione o tipo"),
  status: z.enum(["DISPONIVEL", "VENDIDO", "RESERVADO", "NAO_DISPONIVEL", "ALUGADO"]),
  constructionStage: z.enum(["LANCAMENTO", "EM_OBRA", "PRONTO"]),
  
  // FINALIDADE
  isSale: z.boolean().default(true),
  isRentAnnual: z.boolean().default(false),
  isRentSeason: z.boolean().default(false),
  isRentStudent: z.boolean().default(false),

  // CONFIGURAÇÃO
  showOnSite: z.boolean().default(true),
  isExclusive: z.boolean().default(false),
  hasSign: z.boolean().default(false),

  // DESTAQUES
  isSeaFront: z.boolean().default(false),
  isSeaQuadra: z.boolean().default(false),
  isFurnished: z.boolean().default(false),
  isHighStandard: z.boolean().default(false),
  isDifferentiated: z.boolean().default(false),

  // TARJA
  badgeText: z.string().optional(),
  badgeColor: z.string().optional(),

  // VALORES
  price: z.coerce.number().min(0, "Valor inválido"),
  promotionalPrice: z.coerce.number().optional(),
  hasDiscount: z.boolean().default(false),
  condoFee: z.coerce.number().optional(),
  iptuPrice: z.coerce.number().optional(),

  // NEGOCIAÇÃO
  acceptsFinancing: z.boolean().default(false),
  acceptsConstructionFinancing: z.boolean().default(false),
  acceptsTrade: z.boolean().default(false),
  acceptsVehicle: z.boolean().default(false),
  isMcmv: z.boolean().default(false),

  // DETALHES TÉCNICOS
  privateArea: z.coerce.number().min(0),
  totalArea: z.coerce.number().optional(),
  bedrooms: z.coerce.number().min(0),
  suites: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  garageSpots: z.coerce.number().min(0),
  garageType: z.string().default("Privativa"),
  solarPosition: z.string().optional(),
  relativePosition: z.string().default("Frente"),

  // LOCALIZAÇÃO (Objeto aninhado)
  address: z.object({
    zipCode: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().default("Balneário Camboriú"),
    state: z.string().default("SC"),
  }),
  buildingName: z.string().optional(),
  displayAddress: z.boolean().default(true),

  // DADOS PRIVADOS
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  keysLocation: z.string().optional(),
  brokerNotes: z.string().optional(),

  // DESCRIÇÃO
  description: z.string().optional(),

  // ARRAYS (Listas de Strings)
  roomFeatures: z.array(z.string()).default([]),
  propertyFeatures: z.array(z.string()).default([]),
  developmentFeatures: z.array(z.string()).default([]),
  
  // IMAGENS (Vamos simplificar para array de objetos ou strings)
  images: z.array(z.object({
    url: z.string(),
    isCover: z.boolean().default(false)
  })).default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;