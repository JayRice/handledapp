import { NextRequest, NextResponse } from 'next/server'

export async function GET(req:NextRequest , res: NextResponse) {
    const { body } = req;

    console.log("INSIDE STATUS REQUEST: ", body);

}