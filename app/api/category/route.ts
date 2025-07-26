import { CategoryService } from "@/lib/services/category.service";

export async function GET() {
    try {
        console.log('category start route')
        const categories = await CategoryService.getAllCategories();
        console.log('category end route')
        return Response.json(categories);
    } catch (error) {
        console.error('GET failed:', error);
        return Response.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        console.log('hello backend')
        // Parse the request body
        const body = await request.json();
        console.log("Parsed body:", body);
        const newCategory = await CategoryService.createCategory(body);
        return Response.json(newCategory, { status: 201 });

    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}


// export default async function handler(req, res) {
//     try {
//         switch (req.method) {
//             case "GET":
//                 const categories = await categoryService.getAllCategories();
//                 return res.status(200).json(categories);

//             case "POST":
//                 const newCategory = await categoryService.createCategory(req.body);
//                 return res.status(201).json(newCategory);

//             case "PUT":
//                 const { id, ...data } = req.body;
//                 const updatedCategory = await categoryService.updateCategory(id, data);
//                 return res.status(200).json(updatedCategory);

//             case "DELETE":
//                 const { id: deleteId } = req.body;
//                 await categoryService.deleteCategory(deleteId);
//                 return res.status(204).end();

//             default:
//                 return res.status(405).json({ message: "Method not allowed" });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }