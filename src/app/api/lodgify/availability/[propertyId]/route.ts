import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

const LODGIFY_API_KEY = "q5pwBvym1HAqLtkPKO8x/zypuN8NmJj8NW60ulQ8d63EOwL24nkO19OibL/Vl8zy";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const url = new URL(req.url);
    const startDate = url.searchParams.get('start') || new Date().toISOString().split('T')[0];
    const endDate = url.searchParams.get('end') || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `https://api.lodgify.com/v1/availability/${propertyId}?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'X-ApiKey': LODGIFY_API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!res.ok) {
      return NextResponse.json({ available: [], error: 'Lodgify API error' }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json({ availability: data, propertyId });
  } catch (error) {
    console.error('Lodgify availability error:', error);
    return NextResponse.json({ available: [], error: 'Failed to fetch availability' }, { status: 200 });
  }
}
