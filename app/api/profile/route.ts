import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
// import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const cuser = await auth();
    console.log('cuser', cuser)
    const email = cuser?.user?.email;
    console.log('email', email)
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: cuser?.fullName || cuser?.firstName || email,
        password: "",
        phone: cuser?.phoneNumbers?.[0]?.phoneNumber || null,
        profilePicture: cuser?.imageUrl || null,
      },
      update: {},
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cuser = await currentUser();
    const email = cuser?.emailAddresses?.[0]?.emailAddress;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone, profilePicture } = body || {};

    const updated = await prisma.user.update({
      where: { email },
      data: {
        ...(name != null ? { name: String(name) } : {}),
        ...(phone != null ? { phone: String(phone) } : {}),
        ...(profilePicture != null ? { profilePicture: String(profilePicture) } : {}),
      },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
