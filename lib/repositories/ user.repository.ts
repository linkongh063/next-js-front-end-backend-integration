import prisma from '@/lib/prisma';

export const UserRepository = {
  findAll: () => prisma.user.findMany(),

  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  create: (name: string, email: string) =>
    prisma.user.create({
      data: { name, email },
    }),

  update: (id: number, name: string, email: string) =>
    prisma.user.update({
      where: { id },
      data: { name, email },
    }),

  delete: (id: number) =>
    prisma.user.delete({
      where: { id },
    }),
};
