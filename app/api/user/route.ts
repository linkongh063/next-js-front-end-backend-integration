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
  // Parse the request body
  const body = await request.json();
  const { name } = body;
 
  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };
 
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}