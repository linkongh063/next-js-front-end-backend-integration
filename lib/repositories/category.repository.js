import prisma from "@/lib/prisma";

export const CategoryRepository = {
    getAllCategories: () => {

        console.log('Fetching categories...');
        return prisma.category.findMany({
            include: {
                parent: true,
                children: true,
            },
        });
    },

    async createCategory(data) {
        console.log('data', data)
        return await prisma.category.create({
            data,
        });
    },

    async getCategoryById(id) {
        return await prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            },
        });
    },

    async updateCategory(id, data) {
        return await prisma.category.update({
            where: { id },
            data,
        });
    },

    async deleteCategory(id) {
        return await prisma.category.delete({
            where: { id },
        });
    },
};