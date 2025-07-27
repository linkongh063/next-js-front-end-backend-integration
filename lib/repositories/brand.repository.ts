import  prisma  from '@/lib/prisma';

export const BrandRepository = {
  findAll: () => prisma.brand.findMany(),
  findById: (id: string) => prisma.brand.findUnique({ where: { id } }),
  create: (data: any) => prisma.brand.create({ data }),
  update: (id: string, data: any) =>
    prisma.brand.update({ where: { id }, data }),
  delete: (id: string) => prisma.brand.delete({ where: { id } }),
};