import  prisma  from '@/lib/prisma';

export const ProductVariantRepository = {
  findAll: () =>
    prisma.productVariant.findMany({
      include: {
        product: true,
      },
    }),

  findById: (id: string) =>
    prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: true,
      },
    }),

  create: (data: any) => {
    console.log('data from the repo', data)
    return prisma.productVariant.create({ data })},

  update: (id: string, data: any) =>
    prisma.productVariant.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.productVariant.delete({
      where: { id },
    }),
};
