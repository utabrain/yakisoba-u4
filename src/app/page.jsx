"use client";
import React, { useState, useEffect } from "react";
import SiteHeader from "../components/header";

function Header({ currentPath }) {
  const [isOpen, setIsOpen] = useState(false);

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
  const [activeTab, setActiveTab] = useState("cheers");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const [message, setMessage] = useState("");

  const [user, setUser] = useState("");
  const [quest, setQuest] = useState("");
  const [xp, setXp] = useState("");

  const [users, setUsers] = useState([]);
  const [fromUserNickname, setFromUserNickname] = useState("");
  const [toUserNickname, setToUserNickname] = useState("");

  const [activePage, setActivePage] = useState("cheers");

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
        setError(err.message || "ユーザーの取得中にエラーが発生しました");
      }
    };

    fetchUsers();
  }, []);

  const handleCheersSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fromUserNickname || !toUserNickname || !message) {
      setError("すべての項目を入力してください");
      return;
    }

    try {
      const response = await fetch("/api/submit-cheers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUserNickname,
          toUserNickname,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "送信に失敗しました");
      }

      setSuccess(
        `Cheers from ${fromUserNickname} to ${toUserNickname} was successfully submitted!`
      );
      setFromUser("");
      setToUser("");
      setMessage("");
      setFromUserNickname("");
      setToUserNickname("");
    } catch (err) {
      console.error("Error submitting cheers:", err);
      setError(err.message || "送信中にエラーが発生しました");
    }
  };

  const handleXpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user || !quest || !xp) {
      setError("すべての項目を入力してください");
      return;
    }

    if (isNaN(xp) || parseInt(xp) <= 0) {
      setError("XPは正の数値を入力してください");
      return;
    }

    try {
      const response = await fetch("/api/submit-xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, quest, xp: parseInt(xp) }),
      });

      if (!response.ok) {
        throw new Error("送信に失敗しました");
      }

      setSuccess("XPを記録しました！");
      setUser("");
      setQuest("");
      setXp("");
    } catch (err) {
      setError("送信中にエラーが発生しました");
      console.error(err);
    }
  };

  const handleUserInput = (input, setUser, setNickname) => {
    setNickname(input);
    const user = users.find((u) => u.nickname === input);
    if (user) {
      setUser(user.uuid);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE2FF] to-[#E3F0FF] pb-10">
      <Header currentPath="/" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-md p-4 my-4 text-center shadow-sm">
          <p className="text-sm text-gray-700">
            「チア☆くえすと」は、感謝（Cheers）と挑戦（XP）によるポジティブな社内文化を促進するアプリです。
            <br />
            獲得したCheers、XPに応じて、バッジがゲットできます！
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-left">
              こんにちは、〇〇さん！
            </h2>
            <p className="text-sm text-gray-500">
              今日も誰かにCheersを送りましょう 👏
            </p>
          </div>

          <div className="flex justify-between mb-8">
            <div className="flex-1 text-center">
              <span className="text-4xl">🎁</span>
              <p className="text-3xl font-bold">24</p>
              <p className="text-gray-600">獲得Cheers</p>
            </div>
            <div className="flex-1 text-center">
              <span className="text-4xl">🏅</span>
              <p className="text-3xl font-bold">1250</p>
              <p className="text-gray-600">獲得XP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <a
              href="/send-cheers"
              className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center hover:shadow-lg transition mx-2 my-4 hover:cursor-pointer"
            >
              <span className="text-2xl">🎉</span>
              <h3 className="text-xl font-semibold mt-2 leading-relaxed">
                Cheersを送る
              </h3>
              <p className="text-gray-600">誰かにCheersを送りましょう</p>
            </a>
            <a
              href="/quests"
              className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center hover:shadow-lg transition mx-2 my-4 hover:cursor-pointer"
            >
              <span className="text-2xl">🔍</span>
              <h3 className="text-xl font-semibold mt-2 leading-relaxed">
                クエストを見る
              </h3>
              <p className="text-gray-600">クエストを確認しましょう</p>
            </a>
            <a
              href="/quests/apply"
              className="bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center hover:shadow-lg transition mx-2 my-4 hover:cursor-pointer"
            >
              <span className="text-2xl">✅</span>
              <h3 className="text-xl font-semibold mt-2 leading-relaxed">
                クエスト達成を申請する
              </h3>
              <p className="text-gray-600">達成したクエストを申請</p>
            </a>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-4 gap-y-4">
            <div className="flex space-x-4">
              <div className="bg-white p-4 rounded-md shadow-sm border min-w-[140px] flex flex-col items-center justify-center">
                <span className="text-2xl">🏆</span>
                <p className="text-sm text-gray-600">バッジ名</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border min-w-[140px] flex flex-col items-center justify-center opacity-50">
                <span className="text-2xl">🥇</span>
                <p className="text-sm text-gray-400">未獲得</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border text-center opacity-40">
                <span className="text-2xl">🥈</span>
                <p className="text-sm text-gray-600">未獲得バッジ</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border text-center opacity-40">
                <span className="text-2xl">🥉</span>
                <p className="text-sm text-gray-600">未獲得バッジ</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border text-center opacity-40">
                <span className="text-2xl">🎖️</span>
                <p className="text-sm text-gray-600">未獲得バッジ</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-sm border text-center opacity-40">
                <span className="text-2xl">🏅</span>
                <p className="text-sm text-gray-600">未獲得バッジ</p>
                <p className="text-xs text-gray-400">2025-06-17</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm hover:underline mt-4">
              すべて見る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;