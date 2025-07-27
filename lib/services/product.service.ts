import { ProductRepository } from '@/lib/repositories/product.repository';

export const ProductService = {
  getProducts: () => ProductRepository.findAll(),
  getProductById: (id: string) => ProductRepository.findById(id),
  createProduct: (data: any) => ProductRepository.create(data),
  updateProduct: (id: string, data: any) => ProductRepository.update(id, data),
  deleteProduct: (id: string) => ProductRepository.delete(id),
};
