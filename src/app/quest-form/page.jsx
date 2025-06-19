"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/header";

function QuestCard({ title, xp, description, tags }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-6 flex flex-col justify-between mb-6">
      <div className="mb-4 w-full">
        <div className="flex justify-end">
          <span className="inline-flex items-center bg-amber-400 text-white text-sm font-semibold px-3 py-1 rounded-full gap-1 whitespace-nowrap mb-2">
            <i className="fas fa-trophy w-4 h-4 text-white"></i>
            {`+${xp.toLocaleString()} UFO`}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 truncate mb-2">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-700 mb-4">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-center">
        <button className="px-6 py-2 rounded bg-gradient-to-r from-pink-400 to-indigo-500 text-white hover:opacity-90 transition shadow-md text-sm">
          クエスト申請
        </button>
      </div>
    </div>
  );
}

function LocalHeader({ currentPath }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: "Top", href: "/" },
    { label: "Cheersを送る", href: "/send-cheers" },
    { label: "クエスト", href: "/quests" },
    { label: "バッジ", href: "/badges" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-transparent text-gray-800 px-4 py-3 md:px-10 md:py-4 flex items-center justify-between">
      <a href="/" className="text-2xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-pink-400 to-indigo-600 bg-clip-text text-transparent">
          チア☆くえすと
        </span>
      </a>

      <nav className="hidden md:flex items-center gap-6 text-base font-medium">
        {navItems.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={`px-4 py-2 rounded transition ${
              currentPath === href
                ? "bg-indigo-500 text-white"
                : "text-gray-800 hover:text-indigo-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        className="md:hidden text-indigo-600 focus:outline-none"
        onClick={toggleMenu}
      >
        {isOpen ? "✖️" : "☰"}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-50">
          <nav className="flex flex-col py-4">
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`px-6 py-3 text-base font-medium ${
                  currentPath === href
                    ? "bg-indigo-500 text-white"
                    : "text-gray-800 hover:text-indigo-600 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function MainComponent() {
  const [applicant, setApplicant] = useState("");
  const [title, setTitle] = useState("");
  const [achievement, setAchievement] = useState("");
  const [insights, setInsights] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/get-users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "ユーザーの取得に失敗しました");
        }

        setUsers(result.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResultMessage(null);

    try {
      const response = await fetch("/api/submit-xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: applicant,
          quest_id: 1,
          title,
          achievement,
          insight: insights,
          link,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "申請に失敗しました");
      }

      setResultMessage({ type: "success", text: "申請が完了しました！" });
      setApplicant("");
      setTitle("");
      setAchievement("");
      setInsights("");
      setLink("");
    } catch (err) {
      console.error("Error submitting quest:", err);
      setResultMessage({
        type: "error",
        text: `申請に失敗しました：${err.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE2FF] to-[#E3F0FF] pb-10">
      <LocalHeader currentPath="/quest-form" />
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Title and Description */}
        <div className="text-center mt-10 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            🥳 クエスト申請
          </h1>
          <p className="text-center text-sm text-gray-600 mb-8">
            達成したクエストを申請しましょう。送信内容はTeamsチャンネルに投稿されます。
          </p>
        </div>
        {/* Breadcrumb Link */}
        <nav className="text-sm text-gray-600 mb-4 max-w-3xl mx-auto">
          <a href="/quests" className="hover:underline">
            🔙 クエスト一覧に戻る
          </a>
        </nav>
        {/* Quest Name, Purpose, and Action Example */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-md p-6 shadow-sm max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">
            【クエスト01】📝 企画書勇者
          </h2>
          <div className="mb-3">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
              🎯 クエストの目的
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              企画書は、想いやアイデアを伝え、相手を動かすための力強いツールです。
              <br />
              書いてみることで、提案力や説得力が自然と磨かれていきます。
              <br />
              誰かに任せず、自分の言葉で形にするその一歩を応援します。
            </p>
          </div>
          <div className="mb-3">
            <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
              👀 アクション例
            </h3>
            <ul className="list-disc pl-5 text-base text-gray-700 leading-relaxed space-y-1">
              <li className="leading-relaxed">
                自分が中心になり、入札の企画書を書ききった
              </li>
              <li className="leading-relaxed">
                アイデアをまとめ、社内提案用の企画書を作成した
              </li>
              <li className="leading-relaxed">
                イベントのマニュアルを作成し、チーム内で共有を図った
              </li>
            </ul>
          </div>
        </div>
        {/* Add margin between quest info block and form */}
        <div className="mt-6 mb-8"></div>
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md max-w-3xl mx-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Applicant Field */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="applicant">
                申請者
              </label>
              <p className="text-xs text-gray-500 mb-1">
                あなたの名前を選択してください
              </p>
              <select
                id="applicant"
                name="applicant"
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="">ユーザーを選択</option>
                {users.map((user) => (
                  <option key={user.uuid} value={user.nickname}>
                    {user.nickname}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="title">
                タイトル
              </label>
              <p className="text-xs text-gray-500 mb-1">
                このクエストをどんな名前で記録したいかを入力してください
              </p>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="achievement">
                達成内容
              </label>
              <p className="text-xs text-gray-500 mb-1">
                実際に行ったことを具体的に記述してください
              </p>
              <textarea
                id="achievement"
                name="achievement"
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="insights">
                気づき・学び
              </label>
              <p className="text-xs text-gray-500 mb-1">
                取り組みの中で得た発見や工夫、感じたことを自由に書いてください
              </p>
              <textarea
                id="insights"
                name="insights"
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows="4"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="link">
                リンク（任意）
              </label>
              <p className="text-xs text-gray-500 mb-1">
                成果物のURLや関連資料があれば記載してください
              </p>
              <input
                type="url"
                id="link"
                name="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded bg-gradient-to-r from-pink-400 to-indigo-500 text-white hover:opacity-90 transition shadow-md mx-auto block"
            >
              {isSubmitting ? "送信中..." : "このクエストを申請する"}
            </button>
          </form>
          {resultMessage && (
            <div
              className={`mt-4 text-center text-white p-2 rounded ${
                resultMessage.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {resultMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;