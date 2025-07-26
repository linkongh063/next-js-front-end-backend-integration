import { ProductImageRepository } from '@/lib/repositories/product-image.repository';

export const ProductImageService = {
  getAllImages: () => ProductImageRepository.findAll(),
  getImageById: (id: string) => ProductImageRepository.findById(id),
  createImage: (data: any) => ProductImageRepository.create(data),
  updateImage: (id: string, data: any) => ProductImageRepository.update(id, data),
  deleteImage: (id: string) => ProductImageRepository.delete(id),
};
