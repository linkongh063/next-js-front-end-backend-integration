import prisma from '@/lib/prisma';

export const ProductRepository = {

  findAll: () => {
    // console.log('hit the apis')
    const product = prisma.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
      },
    })
    // console.log('product',product)
    return product
  }
  ,

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
        images: true,
      },
    }),

  create: (data: any) => prisma.product.create({ data }),

  update: (id: string, data: any) =>
    prisma.product.update({
      where: { id },
      data,
    }),

  delete: (id: string) => prisma.product.delete({ where: { id } }),
};
