'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/user');
}
