import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { activateDevice } from "@/actions/license";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { licenseId, chipId, boardType, usbVendorId, usbProductId, nickname } = body;

    if (!licenseId || !chipId || !boardType) {
      return NextResponse.json(
        { error: "Missing required fields: licenseId, chipId, boardType" },
        { status: 400 }
      );
    }

    const result = await activateDevice(
      licenseId,
      chipId,
      boardType,
      usbVendorId ?? null,
      usbProductId ?? null,
      nickname
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/activate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
