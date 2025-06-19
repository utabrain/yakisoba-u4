"use client";
import React, { useState } from "react";
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
  const badges = [
    {
      name: "ルーキー",
      description: "初めてのCheersを獲得",
      date: "2023年10月15日",
    },
    {
      name: "チームプレイヤー",
      description: "10回のCheersを獲得",
      date: "2023年11月22日",
    },
    {
      name: "イノベーター",
      description: "初めてのクエスト達成",
      date: "2023年12月5日",
    },
    {
      name: "マスター",
      description: "すべてのカテゴリでクエスト達成",
      date: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE2FF] to-[#E3F0FF] pb-10">
      <LocalHeader currentPath="/badges" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          🎖️ バッジ一覧
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          ここでは、あなたが獲得したバッジを確認できます。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                badge.date
                  ? "bg-white shadow-sm border border-gray-100"
                  : "opacity-50 cursor-default"
              }`}
            >
              <div className="bg-gray-200 w-full h-[100px] flex items-center justify-center mb-4">
                <span className="text-4xl">🏅</span>
              </div>
              <h3 className="text-lg font-bold">{badge.name}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {badge.date ? badge.date : "未獲得"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;