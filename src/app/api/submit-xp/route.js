import { NextResponse } from "next/server";

async function handler({
  user_name,
  quest_id,
  title,
  achievement,
  insight,
  link,
}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: "Supabase configuration is missing",
    });
  }

  if (!user_name || !quest_id || !title || !achievement || !insight) {
    return NextResponse.json({
      success: false,
      error: "Missing required fields",
    });
  }

  // Debugging logs for API values
  console.log("[DEBUG] Supabase URL:", supabaseUrl);
  console.log("[DEBUG] Supabase Key:", supabaseKey);
  console.log("[DEBUG] User Name:", user_name);
  console.log("[DEBUG] Quest ID:", quest_id);
  console.log("[DEBUG] Title:", title);
  console.log("[DEBUG] Achievement:", achievement);
  console.log("[DEBUG] Insight:", insight);
  console.log("[DEBUG] Link:", link);

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/insert_xp`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_user_name: user_name,
        p_quest_id: quest_id,
        p_title: title,
        p_achievement: achievement,
        p_insight: insight,
        p_link: link,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase RPC error:", errorText);
      return NextResponse.json({
        success: false,
        error: "Failed to save XP record",
      });
    }

    return NextResponse.json({
      success: true,
      message: "XP inserted",
    });
  } catch (error) {
    console.error("Error calling insert_xp:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process request",
    });
  }
}

export async function POST(request) {
  return handler(await request.json());
}