import { CategoryService } from "@/lib/services/category.service";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log("Deleting category:", id);

    await CategoryService.deleteCategory(id);

    return Response.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Delete failed:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}