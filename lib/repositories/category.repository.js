import prisma from "@/lib/prisma";

export const CategoryRepository = {
    getAllCategories: () => {
        return prisma.category.findMany({
            where: {
                parentId: null, // Fetch categories that do not have a parentId (i.e., parent categories)
            },
            include: {
                children: {
                    include: {
                        children: true
                    }
                },
            },
        });
    },

    getCategoryForCreation: async () => {
        return prisma.category.findMany({
            where: {
                parentId: null, // Top-level only
            },
            include: {
                children: {
                    include: {
                        children: true
                    }
                },
            },
        });
    },

    createCategory: (data) => {
        console.log('data create', data)
        return prisma.category.create({
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