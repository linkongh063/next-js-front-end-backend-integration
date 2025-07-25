import prisma from '@/lib/prisma';

export const UserRepository = {
  findAll: () => prisma.user.findMany(),

  findById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
    }),

  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
    }),

  create: (name: string, email: string, password: string, phone: string) =>
    prisma.user.create({
      data: { name, email, password, phone },
    }),

  update: (id: string, name: string, email: string) =>
    prisma.user.update({
      where: { id },
      data: { name, email },
    }),

  delete: (id: string) =>
    prisma.user.delete({
      where: { id },
    }),
};
