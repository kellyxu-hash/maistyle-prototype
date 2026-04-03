import { useState } from "react";
import { useNavigate } from "react-router";
import { FolderPlus, SlidersHorizontal, FileEdit, UserRound, Plus, Paperclip, ArrowUp, X, Calendar } from "lucide-react";
import { CreateProjectModal, type Project } from "../components/CreateProjectModal";

const PROJECTS_KEY = "maistyle-projects";

const mockProjects: Project[] = [
  { id: "1", name: "2025 Fall & Winter Looks", date: "March 20, 2026", itemCount: 27, generatedCount: 150, thumbnail: "/Outfit_Summer.jpg", status: "in-progress" },
  { id: "2", name: "Fall / Winter Collection", date: "March 15, 2026", itemCount: 45, generatedCount: 200, thumbnail: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", status: "completed" },
];

function loadInProgressProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      const all: Project[] = JSON.parse(raw);
      return all.filter(p => p.status === "in-progress");
    }
  } catch {}
  return mockProjects.filter(p => p.status === "in-progress");
}

function getProjectTitle(id: string, fallback: string): string {
  return localStorage.getItem(`project-title-${id}`) ?? fallback;
}

export function HomePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const inProgressProjects = showResumeModal ? loadInProgressProjects() : [];

  const actions = [
    {
      icon: <FolderPlus className="w-7 h-7 text-[#E5A0A0]" />,
      title: "Create a new project",
      description: "Guide you through details of a marketing campaign with ease.",
      onClick: () => setShowCreateModal(true),
    },
    {
      icon: <SlidersHorizontal className="w-7 h-7 text-[#E5A0A0]" />,
      title: "Resume an existing project",
      description: "Refine your outfits, models, vibe images, or videos, and get ready to publish.",
      onClick: () => setShowResumeModal(true),
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
        <div className="flex items-center gap-2 mb-8">
          <img src="/logo.png" alt="MAIStyle" className="h-7 w-auto" style={{ filter: "none" }} />
          <span className="text-2xl font-semibold tracking-tight" style={{ color: "#DCB297" }}>MAIStyle</span>
        </div>

        <h1 className="text-4xl font-light text-gray-900 text-center leading-tight mb-3">
          {greeting},<br />what can I help you with?
        </h1>

        <p className="text-base text-gray-600 text-center mb-10">
          <span className="text-[#E5A0A0] font-medium">✦ MAIStyle AI Assistant</span>
          {" "}helps you create fashion content with ease, in minutes.
        </p>

        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {actions.map(action => (
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
          <img src="/AI_chat.png" alt="AI orb" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
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

      {/* Create New Project Modal — shared component */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Resume Project Modal */}
      {showResumeModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) setShowResumeModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Resume a Project</h2>
                <p className="text-sm text-gray-500 mt-1">Pick up where you left off.</p>
              </div>
              <button onClick={() => setShowResumeModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-6 flex flex-col gap-3">
              {inProgressProjects.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-base">No projects in progress yet.</p>
                  <p className="text-sm mt-1">Create a new project to get started.</p>
                </div>
              ) : (
                inProgressProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 hover:border-[#DCB297] hover:shadow-sm transition-all text-left group"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{getProjectTitle(project.id, project.name)}</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{project.date}</span>
                      </div>
                    </div>
                    <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full border border-white/30 flex-shrink-0">
                      In Progress
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
