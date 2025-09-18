// types/product.ts
import type { Prisma } from "@prisma/client";

export type Brand = {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    createdAt: Date | string;
  };
  
  export type Category = {
    id: string;
    name: string;
    slug: string;
    parentId?: string | null;
    createdAt: Date | string;
  };
  
  export type ProductImage = {
    id: string;
    productId: string;
    imageUrl: string;
    isFeatured: boolean;
    createdAt: Date | string;
  };
  
  export type ProductVariant = {
    id: string;
    productId: string;
    sku: string;
    price: Prisma.Decimal | string | number; // Prisma returns Decimal; allow string/number when normalized
    cost?: Prisma.Decimal | string | number | null;
    stockQuantity: number;
    stockAlertThreshold?: number;
    isDefault?: boolean;
    createdAt: Date | string;
  };
  
  export type Product = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    createdAt: Date | string;
    updatedAt: Date | string;
  
    // Relations
    brandId?: string | null;
    brand?: Brand | null;
  
    categoryId?: string | null;
    category?: Category | null;
  
    images: ProductImage[];
    variants: ProductVariant[];
  };
  