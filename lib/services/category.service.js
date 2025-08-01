import { CategoryRepository } from "@/lib/repositories/category.repository";

export const CategoryService = {
    getAllCategories: async () => {
        return await CategoryRepository.getAllCategories();
    },
    getCategoryForCreation: async () => {
        const topLevelCategories = await CategoryRepository.getCategoryForCreation();
        // Flatten all level 2 children into a single array
        console.log('levelTwoCreate 1', topLevelCategories)

        const levelTwoCategories = topLevelCategories.flatMap(category => category.children);
        console.log('levelTwoCreate 2', levelTwoCategories)
        return [...topLevelCategories, ...levelTwoCategories];
    },
    createCategory: async (data) => {
        console.log('service', data)
        return await CategoryRepository.createCategory(data);
    },

    getCategoryById: async (id) => {
        return await CategoryRepository.getCategoryById(id);
    },

    updateCategory: async (id, data) => {
        return await CategoryRepository.updateCategory(id, data);
    },

    deleteCategory: async (id) => {
        return await CategoryRepository.deleteCategory(id);
    },
};