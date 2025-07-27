import { BrandRepository } from '@/lib/repositories/brand.repository';

export const BrandService = {
  getBrands: () => BrandRepository.findAll(),
  getBrandById: (id: string) => BrandRepository.findById(id),
  createBrand: (data: any) => BrandRepository.create(data),
  updateBrand: (id: string, data: any) => BrandRepository.update(id, data),
  deleteBrand: (id: string) => BrandRepository.delete(id),
};
