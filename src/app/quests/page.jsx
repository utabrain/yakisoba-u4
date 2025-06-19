"use client";
import React from "react";
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
  const categories = [
    {
      title: "🙋 やってみる！実務クエスト",
      quests: [
        {
          title: "📝 企画書勇者",
          xp: 100,
          description: "まだ荒削りでも、その一歩が世界を動かす",
          tags: ["やってみる！"],
        },
        {
          title: "🛡 イベントの守り人",
          xp: 100,
          description: "仲間を支え、現場を支える縁の下の力持ち",
          tags: ["やってみる！"],
        },
        {
          title: "⚽ 新規受注ストライカー",
          xp: 400,
          description: "信頼を築き、走ってつかむ初オーダー！",
          tags: ["やってみる！"],
        },
      ],
    },
    {
      title: "✨ きづかう！改善クエスト",
      quests: [
        {
          title: "⏰ 締切番長",
          xp: 50,
          description: "期限を察知し、チーム全員の凡事徹底を裏支え",
          tags: ["きづかう！"],
        },
        {
          title: "👥 タスク山の影分身",
          xp: 100,
          description: "忙しい人のタスクを、まるっと引き取る神",
          tags: ["きづかう！"],
        },
        {
          title: "🛠 業務改善マエストロ",
          xp: 200,
          description: "現場の困りごとを、工夫で解決する改善職人",
          tags: ["きづかう！"],
        },
      ],
    },
    {
      title: "🌱 そだてる！学びクエスト",
      quests: [
        {
          title: "⚡ ライトニングトーク挑戦者",
          xp: 100,
          description: "学び・プロジェクト進捗、何でも5分プレゼン",
          tags: ["そだてる！"],
        },
        {
          title: "📈 育成の守護神",
          xp: 200,
          description: "育成プランや学習ガイドを整え、後輩の成長支援",
          tags: ["そだてる！"],
        },
        {
          title: "🎪 社内カルチャー演出家",
          xp: 200,
          description: "社内イベントを開催し、学びの文化を育てる",
          tags: ["そだてる！"],
        },
      ],
    },
    {
      title: "🚀 ばくそく！変革クエスト",
      quests: [
        {
          title: "🎈 未来キャッチャー",
          xp: 50,
          description: "新規ビジネスにつながる情報や気づきを共有",
          tags: ["ばくそく！"],
        },
        {
          title: "🔥 放置課題ブレイカー",
          xp: 100,
          description: "長年手つかずの課題を、スピード重視で解決",
          tags: ["ばくそく！"],
        },
        {
          title: "💻 プロトタイプ営業局",
          xp: 200,
          description: "バイブコーディングでサクッと試作、即営業",
          tags: ["ばくそく！"],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDE2FF] to-[#E3F0FF] pb-10">
      <LocalHeader currentPath="/quests" />
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          💎 クエスト一覧
        </h1>
        <p className="text-center text-sm text-gray-600 mb-8">
          現在挑戦できるクエストの一覧です。達成するとXPを獲得できます。
        </p>

        {categories.map((category, cIndex) => (
          <div key={cIndex} className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 tracking-wide mb-4">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.quests.map((quest, qIndex) => (
                <QuestCard key={qIndex} {...quest} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainComponent;