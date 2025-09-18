import { ProductVariantRepository } from '@/lib/repositories/product-variant.repository';

export const ProductVariantService = {
  getVariants: () => ProductVariantRepository.findAll(),
  getVariantById: (id: string) => ProductVariantRepository.findById(id),
  createVariant: (data: any) => ProductVariantRepository.create(data),
  updateVariant: (id: string, data: any) => ProductVariantRepository.update(id, data),
  deleteVariant: (id: string) => ProductVariantRepository.delete(id),
};
