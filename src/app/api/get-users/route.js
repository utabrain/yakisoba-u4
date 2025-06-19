import { NextResponse } from "next/server";

async function handler() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      error: "Supabase configuration is missing",
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?active=eq.true`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch users from Supabase:", errorText);
      return NextResponse.json({
        success: false,
        error: "Failed to fetch users",
      });
    }

    const users = await response.json();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch users",
    });
  }
}

export async function POST(request) {
  return handler();
}