import { useState } from "react";
import { useNavigate } from "react-router";
import { FolderPlus, SlidersHorizontal, FileEdit, UserRound, Plus, Paperclip, ArrowUp, Sparkles } from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const actions = [
    {
      icon: <FolderPlus className="w-7 h-7 text-[#E5A0A0]" />,
      title: "Create a new project",
      description: "Guide you through details of a marketing campaign with ease.",
      onClick: () => navigate("/"),
    },
    {
      icon: <SlidersHorizontal className="w-7 h-7 text-[#E5A0A0]" />,
      title: "Resume an existing project",
      description: "Refine your outfits, models, vibe images, or videos, and get ready to publish.",
      onClick: () => navigate("/"),
    },
    {
      icon: <FileEdit className="w-7 h-7 text-gray-500" />,
      title: "Add your brand DNA",
      description: "Upload brand guidelines and reference images to keep all content consistent.",
      onClick: () => navigate("/brand"),
    },
    {
      icon: <UserRound className="w-7 h-7 text-gray-500" />,
      title: "Customize your models",
      description: "Match the best digital models to represent your campaign vision.",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-auto flex flex-col items-center justify-center px-8 py-12">
        {/* Logo + wordmark */}
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="MAIStyle" className="h-7 w-auto" style={{ filter: "none" }} />
          <span className="text-2xl font-semibold tracking-tight" style={{ color: "#DCB297" }}>MAIStyle</span>
        </div>

        {/* Greeting */}
        <h1 className="text-4xl font-light text-gray-900 text-center leading-tight mb-3">
          {greeting},<br />what can I help you with?
        </h1>

        {/* Subtitle */}
        <p className="text-base text-gray-600 text-center mb-10">
          <span className="text-[#E5A0A0] font-medium">✦ MAIStyle AI Assistant</span>
          {" "}helps you create fashion content with ease, in minutes.
        </p>

        {/* Action cards */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {actions.map((action) => (
            <button
              key={action.title}
              onClick={action.onClick}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-[#DCB297] hover:shadow-md transition-all text-left"
            >
              <div className="flex-shrink-0 mt-0.5">{action.icon}</div>
              <div>
                <p className="font-semibold text-gray-900 mb-1">{action.title}</p>
                <p className="text-sm text-gray-500 leading-snug">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat input bar */}
      <div className="px-8 pb-6">
        <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200 shadow-sm px-4 py-3 max-w-2xl mx-auto">
          {/* Avatar orb */}
          <img
            src="/Chatbubble.gif"
            alt="AI orb"
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover opacity-50"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What are you envisioning?"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: message ? "linear-gradient(135deg, #DCB297, #7575B1)" : "#e5e7eb" }}
          >
            <ArrowUp className={`w-4 h-4 ${message ? "text-white" : "text-gray-400"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
