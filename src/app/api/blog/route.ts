import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = 'edge';

export async function GET() {
  try {
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
