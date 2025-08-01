import { CategoryService } from "@/lib/services/category.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const category = await CategoryService.getCategoryById(id);
    
    if (!category) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return Response.json(category);
  } catch (error: any) {
    console.error("Get category failed:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedCategory = await CategoryService.updateCategory(id, body);
    
    return Response.json(updatedCategory);
  } catch (error: any) {
    console.error("Update category failed:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log("Deleting category:", id);

    await CategoryService.deleteCategory(id);

    return Response.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("Delete failed:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}