import { CategoryService } from "@/lib/services/category.service";

export async function GET() {
    try {
        const categories = await CategoryService.getCategoryForCreation();
        return Response.json(categories);
    } catch (error) {
        console.error('GET failed:', error);
        return Response.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}
