import { AttributeValueRepository } from '@/lib/repositories/attribute-value.repository';

export const AttributeValueService = {
  getAll: () => AttributeValueRepository.findAll(),
  getById: (id: string) => AttributeValueRepository.findById(id),
  create: (data: any) => AttributeValueRepository.create(data),
  update: (id: string, data: any) => AttributeValueRepository.update(id, data),
  delete: (id: string) => AttributeValueRepository.delete(id),
};
