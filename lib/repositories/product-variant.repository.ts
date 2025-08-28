import  prisma  from '@/lib/prisma';

export const ProductVariantRepository = {
  findAll: async () => {
    const variants = await prisma.productVariant.findMany({
      include: { product: true },
    });
    const ids = variants.map(v => v.id);
    if (ids.length === 0) return variants.map(v => ({ ...v, attributes: [] }));
    const links = await prisma.productVariantAttribute.findMany({
      where: { variantId: { in: ids } },
      include: { attributeValue: { include: { attribute: true } } },
    });
    const byVariant: Record<string, typeof links> = {} as any;
    for (const link of links) {
      (byVariant[link.variantId] ||= []).push(link);
    }
    return variants.map(v => ({ ...v, attributes: byVariant[v.id] || [] }));
  },

  findById: async (id: string) => {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!variant) return null;
    const attrs = await prisma.productVariantAttribute.findMany({
      where: { variantId: id },
      include: { attributeValue: { include: { attribute: true } } },
    });
    return { ...variant, attributes: attrs } as any;
  },

  create: async (data: any) => {
    const { attributeValueIds, ...variantData } = data || {};
    const created = await prisma.productVariant.create({ data: variantData, include: { product: true } });
    if (Array.isArray(attributeValueIds) && attributeValueIds.length) {
      await prisma.productVariantAttribute.createMany({
        data: attributeValueIds.map((valueId: string) => ({ variantId: created.id, attributeValueId: valueId })),
      });
    }
    const attrs = await prisma.productVariantAttribute.findMany({
      where: { variantId: created.id },
      include: { attributeValue: { include: { attribute: true } } },
    });
    return { ...created, attributes: attrs } as any;
  },

  update: async (id: string, data: any) => {
    const { attributeValueIds, ...variantData } = data || {};
    const updated = await prisma.productVariant.update({ where: { id }, data: variantData, include: { product: true } });
    if (Array.isArray(attributeValueIds)) {
      await prisma.productVariantAttribute.deleteMany({ where: { variantId: id } });
      if (attributeValueIds.length) {
        await prisma.productVariantAttribute.createMany({
          data: attributeValueIds.map((valueId: string) => ({ variantId: id, attributeValueId: valueId })),
        });
      }
    }
    const attrs = await prisma.productVariantAttribute.findMany({
      where: { variantId: id },
      include: { attributeValue: { include: { attribute: true } } },
    });
    return { ...updated, attributes: attrs } as any;
  },

  delete: (id: string) =>
    prisma.productVariant.delete({
      where: { id },
    }),
};

