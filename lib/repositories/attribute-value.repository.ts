import prisma from '@/lib/prisma';

export const AttributeValueRepository = {
  findAll: () =>
    prisma.attributeValue.findMany({
      include: { attribute: true },
      orderBy: [{ attribute: { name: 'asc' } }, { value: 'asc' }],
    }),

  findById: (id: string) =>
    prisma.attributeValue.findUnique({
      where: { id },
      include: { attribute: true },
    }),

  create: (data: any) => prisma.attributeValue.create({ data }),

  update: (id: string, data: any) =>
    prisma.attributeValue.update({ where: { id }, data }),

  delete: (id: string) => prisma.attributeValue.delete({ where: { id } }),
};
