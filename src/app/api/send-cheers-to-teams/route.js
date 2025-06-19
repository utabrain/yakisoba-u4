async function handler() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

  if (!supabaseUrl || !supabaseKey || !teamsWebhookUrl) {
    return Response.json({
      success: false,
      error: "Missing required environment variables",
    });
  }

  try {
    // 最大20件の未送信のCheersを取得
    const response = await fetch(
      `${supabaseUrl}/rest/v1/cheers_logs?sent_to_teams=eq.false&limit=20`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch from Supabase:", errorText);
      return Response.json({
        success: false,
        error: "Failed to fetch cheers from database",
      });
    }

    const cheers = await response.json();

    if (cheers.length === 0) {
      return Response.json({
        success: true,
        message: "No new cheers to send",
      });
    }

    const successfulIds = [];

    for (const cheer of cheers) {
      // 各行を1メッセージとしてTeamsに送信
      const formattedMessage = cheer.message.replace(/\r?\n/g, "<br>");
      const message = `🎉 <b>${cheer.from_user} さんから ${cheer.to_user} さんへ、新しいCheersが届きました！</b><br>${formattedMessage}`;

      const teamsResponse = await fetch(teamsWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (teamsResponse.ok) {
        successfulIds.push(cheer.id);
      } else {
        const errorText = await teamsResponse.text();
        console.error("Teams webhook error:", errorText);
      }
    }

    if (successfulIds.length > 0) {
      const query = `id=in.(${successfulIds.join(",")})`;
      const updateResponse = await fetch(
        `${supabaseUrl}/rest/v1/cheers_logs?${query}`,
        {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            sent_to_teams: true,
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error("Failed to update sent_to_teams flag:", errorText);
        return Response.json({
          success: false,
          error: "Failed to update sent status",
        });
      }
    }

    return Response.json({
      success: true,
      message: "Posted to Teams",
      processed: successfulIds.length,
    });
  } catch (error) {
    console.error("Error in send-cheers-to-teams:", error);
    return Response.json({
      success: false,
      error: "Failed to process cheers",
    });
  }
}

module.exports = { POST: handler, GET: handler };
export async function POST(request) {
  return handler(await request.json());
}