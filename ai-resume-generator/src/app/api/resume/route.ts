import { NextResponse } from "next/server";
import { parseJD } from "@/core/jd/parseJD";

export async function POST(req: Request) {
  const body = await req.json();

  // Validate input
  // Call core logic
  // Call AI if needed
  // Format + generate PDF

  return NextResponse.json({ status: "ok" });
}
