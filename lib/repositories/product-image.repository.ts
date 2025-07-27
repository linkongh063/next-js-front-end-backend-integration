import prisma  from '@/lib/prisma';

export const ProductImageRepository = {
  findAll: () =>
    prisma.productImage.findMany({
      include: { product: true },
    }),

  findById: (id: string) =>
    prisma.productImage.findUnique({
      where: { id },
      include: { product: true },
    }),

  create: (data: any) =>
    prisma.productImage.create({ data }),

  update: (id: string, data: any) =>
    prisma.productImage.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.productImage.delete({
      where: { id },
    }),
};
