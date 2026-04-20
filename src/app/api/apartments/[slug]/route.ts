import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = 'edge';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { data: apartment, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('slug', slug)
      .eq('available', true)
      .single();

    if (error || !apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }
    return NextResponse.json({ apartment });
  } catch (error) {
    console.error('Error fetching apartment:', error);
    return NextResponse.json({ error: "Failed to fetch apartment" }, { status: 500 });
  }
}
