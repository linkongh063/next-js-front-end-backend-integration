import { AttributeRepository } from '@/lib/repositories/attribute.repository';

export const AttributeService = {
  getAll: () => AttributeRepository.findAll(),
  getById: (id: string) => AttributeRepository.findById(id),
  create: (data: any) => AttributeRepository.create(data),
  update: (id: string, data: any) => AttributeRepository.update(id, data),
  delete: (id: string) => AttributeRepository.delete(id),
};
