"use client";
import React, { useState, useEffect } from "react";
import Header from "../../components/header";

function LocalHeader({ currentPath }) {
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
  const [toUserNickname, setToUserNickname] = useState("");
  const [fromUserNickname, setFromUserNickname] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


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
          throw new Error(result.error || "Failed to fetch users");
        }

        setUsers(result.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Error fetching users");
      }
    };

    fetchUsers();

    // Load fromUserNickname from cookies
    const savedFromUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("fromUserNickname="))
      ?.split("=")[1];

    if (savedFromUser) {
      setFromUserNickname(decodeURIComponent(savedFromUser));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fromUserNickname || !toUserNickname || !message) {
      setError("Please fill in all fields");
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
        throw new Error(result.error || "Failed to send cheers");
      }

      setSuccess("Cheers successfully sent!");
      setFromUserNickname("");
      setToUserNickname("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting cheers:", err);
      setError(err.message || "Error submitting cheers");
    }
  };

  const handleUserInput = (input, setUser, setNickname) => {
    setNickname(input);
    const user = users.find((u) => u.nickname === input);
    if (user) {
      setUser(user.uuid);
    }
  };

  const handleFromUserChange = (e) => {
    const selectedNickname = e.target.value;
    setFromUserNickname(selectedNickname);
    document.cookie = `fromUserNickname=${encodeURIComponent(
      selectedNickname
    )}; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE2FF] to-[#E3F0FF]">
      <LocalHeader currentPath="/send-cheers" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          🎉 Cheersを送る
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          感謝の気持ちを伝えましょう。送信内容はTeamsチャンネルに投稿されます。
        </p>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto p-6 mt-10 mb-16">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="fromUser">
                送信者
              </label>
              <select
                id="fromUser"
                name="fromUser"
                value={fromUserNickname}
                onChange={handleFromUserChange}
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
              <label className="block text-gray-700 mb-2" htmlFor="toUser">
                送る相手
              </label>
              <select
                id="toUser"
                name="toUser"
                value={toUserNickname}
                onChange={(e) => setToUserNickname(e.target.value)}
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
              <label className="block text-gray-700 mb-2" htmlFor="message">
                感謝のメッセージ
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                rows="4"
              />
              <p className="text-xs text-gray-500 mt-1">
                感謝の理由や具体的な褒めポイントを書くとより伝わります
              </p>
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded bg-gradient-to-r from-pink-400 to-indigo-500 text-white hover:opacity-90 transition shadow-md mx-auto block"
            >
              Cheersを送る
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;