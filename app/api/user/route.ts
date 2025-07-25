import { UserService } from '@/lib/services/user.service';

export async function GET() {
  try {
    const users = await UserService.getAllUsers();
    return Response.json(users);
  } catch (error) {
    console.error('GET failed:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    const user = await UserService.createUser(name, email);
    return Response.json(user, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, email } = await request.json();
    const user = await UserService.updateUser(Number(id), name, email);
    return Response.json(user);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await UserService.deleteUser(Number(id));
    return Response.json({ message: 'User deleted' });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
