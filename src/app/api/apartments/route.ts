import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = 'edge';

export async function GET() {
  try {
    const { data: apartments, error } = await supabase
      .from('apartments')
      .select('*')
      .eq('available', true)
      .order('sort_order');

    if (error) throw error;
    return NextResponse.json({ apartments });
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
  }
}
