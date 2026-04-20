import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = 'edge';
export const revalidate = 86400; // 24h cache

export async function GET() {
  try {
    // Check cache in DB first
    const { data: cached } = await supabase
      .from('exchange_rates')
      .select('rate, fetched_at')
      .eq('from_currency', 'DOP')
      .eq('to_currency', 'USD')
      .single();

    const now = Date.now();
    const fetchedAt = cached?.fetched_at ? new Date(cached.fetched_at).getTime() : 0;
    const isStale = now - fetchedAt > 24 * 60 * 60 * 1000; // 24h

    if (cached && !isStale) {
      return NextResponse.json({ rate: cached.rate, source: 'cache', fetched_at: cached.fetched_at });
    }

    // Fetch fresh rate from open.er-api.com (free, no key)
    const res = await fetch('https://open.er-api.com/v6/latest/DOP', {
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      const rate = data.rates?.USD;
      if (rate) {
        // Update cache
        await supabase
          .from('exchange_rates')
          .upsert({ from_currency: 'DOP', to_currency: 'USD', rate, fetched_at: new Date().toISOString() },
            { onConflict: 'from_currency,to_currency' });

        return NextResponse.json({ rate, source: 'live', fetched_at: new Date().toISOString() });
      }
    }

    // Fallback to cached or default
    return NextResponse.json({
      rate: cached?.rate ?? 0.0167,
      source: 'fallback',
      fetched_at: cached?.fetched_at ?? new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ rate: 0.0167, source: 'error' });
  }
}
