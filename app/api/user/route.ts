import prisma from "@/lib/prisma";


export async function GET(request: Request) {
    // For example, fetch data from your DB here
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await res.json();

    console.log('Im from api hit:', users);

    return new Response(JSON.stringify(users), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST(request: Request) {

    const body = await request.json();
    const { name, email } = body
    console.log('name', name, ' - email', email)
    try {
        const user = await prisma.user.create({ data: { name, email } });
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'User creation failed' })), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        }
    }
}