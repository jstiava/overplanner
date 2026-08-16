import { NextRequest, NextResponse } from 'next/server';

export default async function GET(req: NextRequest) {

  try {

    return NextResponse.json({
      success: true,
      message: "Request successful"
    });

  }
  catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'An unknown error.' },
      { status: 400 }
    );
  }

}