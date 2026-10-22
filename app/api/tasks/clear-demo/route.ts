import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDjangoApiUrl } from "@/app/lib/api/getDjangoApiUrl";

async function proxyClearDemo() {
  const accessToken = (await cookies()).get('access')?.value;
  if (!accessToken) {
    return NextResponse.json({ detail: "Not authenticated: no access token" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(getDjangoApiUrl("auth/tasks/clear-demo/"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ detail: "Internal server error clearing demo tasks" }, { status: 500 });
  }
}

export async function POST() {
  return proxyClearDemo();
}

export async function DELETE() {
  return proxyClearDemo();
}
