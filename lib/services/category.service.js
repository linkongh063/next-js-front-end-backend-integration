import { CategoryRepository } from "@/lib/repositories/category.repository";

export const CategoryService = {
    getAllCategories: async () => {
        return await CategoryRepository.getAllCategories();
    },
    getCategoryForCreation: async () => {
        return await CategoryRepository.getCategoryForCreation();
    },
    createCategory: async (data) => {
        console.log('service', data)
        return await CategoryRepository.createCategory(data);
    },


    // async getCategoryById(id) {
    //     return await categoryRepository.getCategoryById(id);
    // },

    // async updateCategory(id, data) {
    //     return await categoryRepository.updateCategory(id, data);
    // },

    // async deleteCategory(id) {
    //     return await categoryRepository.deleteCategory(id);
    // },
};