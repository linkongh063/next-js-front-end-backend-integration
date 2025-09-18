import  prisma  from '@/lib/prisma';

export const ProductVariantRepository = {
  findAll: async () => {
    const variants = await prisma.productVariant.findMany({
      include: { product: true },
    });
    console.log('variants',variants);
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
    // Ensure productId and sku are present
    if (!variantData?.productId) throw new Error('productId is required');
    if (!variantData?.sku) throw new Error('sku is required');

    const created = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.create({ data: variantData, include: { product: true } });

      if (Array.isArray(attributeValueIds) && attributeValueIds.length) {
        await tx.productVariantAttribute.createMany({
          data: attributeValueIds.map((valueId: string) => ({ variantId: v.id, attributeValueId: valueId })),
        });
      }

      // If this is set as default, unset others for the same product
      if (variantData?.isDefault) {
        await tx.productVariant.updateMany({
          where: { productId: v.productId, id: { not: v.id } },
          data: { isDefault: false },
        });
      }

      return v;
    });

    const attrs = await prisma.productVariantAttribute.findMany({
      where: { variantId: created.id },
      include: { attributeValue: { include: { attribute: true } } },
    });
    return { ...created, attributes: attrs } as any;
  },

  update: async (id: string, data: any) => {
    const { attributeValueIds, ...variantData } = data || {};

    const updated = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.update({ where: { id }, data: variantData, include: { product: true } });

      if (Array.isArray(attributeValueIds)) {
        await tx.productVariantAttribute.deleteMany({ where: { variantId: id } });
        if (attributeValueIds.length) {
          await tx.productVariantAttribute.createMany({
            data: attributeValueIds.map((valueId: string) => ({ variantId: id, attributeValueId: valueId })),
          });
        }
      }

      // If now default, unset others for the same product
      if (variantData?.isDefault) {
        await tx.productVariant.updateMany({
          where: { productId: v.productId, id: { not: v.id } },
          data: { isDefault: false },
        });
      }

      return v;
    });

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
