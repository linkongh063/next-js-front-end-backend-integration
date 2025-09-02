import prisma from '@/lib/prisma';

export const AttributeRepository = {
  findAll: () =>
    prisma.attribute.findMany({
      include: { values: true },
      orderBy: { name: 'asc' },
    }),

  findById: (id: string) =>
    prisma.attribute.findUnique({
      where: { id },
      include: { values: true },
    }),

  create: (data: any) => {
    console.log('data',data)
    return prisma.attribute.create({ data })
  },

  update: (id: string, data: any) =>
    prisma.attribute.update({ where: { id }, data }),

  delete: (id: string) => prisma.attribute.delete({ where: { id } }),
};
