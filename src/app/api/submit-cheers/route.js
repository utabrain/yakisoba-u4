import { NextResponse } from "next/server";

async function handler({ fromUserNickname, toUserNickname, message }) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: "Supabase configuration is missing",
    });
  }

  if (!fromUserNickname || !toUserNickname || !message) {
    return NextResponse.json({
      success: false,
      error: "Missing required fields",
    });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/insert_cheer`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_from_user: fromUserNickname,
        p_to_user: toUserNickname,
        p_message: message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase RPC error:", errorText);
      return NextResponse.json({
        success: false,
        error: "Failed to save cheers",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error calling insert_cheer:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process request",
    });
  }
}

export async function POST(request) {
  return handler(await request.json());
}