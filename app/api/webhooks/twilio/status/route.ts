import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    return new Response("OK", { status: 200 });
}
