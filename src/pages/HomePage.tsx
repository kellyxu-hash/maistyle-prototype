import { useState } from "react";
import { useNavigate } from "react-router";
import { FolderPlus, SlidersHorizontal, FileEdit, UserRound, Plus, Paperclip, ArrowUp, X, Calendar, Search } from "lucide-react";

const PROJECTS_KEY = "maistyle-projects";

interface Project {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  generatedCount: number;
  thumbnail: string;
  status: "in-progress" | "completed";
}

const templates = [
  { id: "spring-summer", name: "Spring / Summer Collection", description: "Fresh, breathable, vibrant looks for warm, active seasons.", image: "/Outfit_Summer.jpg" },
  { id: "fall-winter", name: "Fall / Winter Collection", description: "Layered, textured, structured looks for colder, richer seasons.", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { id: "everyday", name: "Everyday Look", description: "Clean, polished daily outfits with effortless style.", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80" },
  { id: "weekend-brunch", name: "Weekend & Brunch", description: "Relaxed, social daytime looks with warmth and ease.", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80" },
  { id: "date-night", name: "Date Night & Evening", description: "Emotional, refined looks for intimate or social evenings.", image: "/Outfit_Night.png" },
  { id: "workwear", name: "Modern Workwear", description: "Structured, confident outfits for professional environments.", image: "/Outfit_BusinessCasual.png" },
  { id: "smart-casual", name: "Smart Casual Transition", description: "From office to after-work, flexible and adaptive styling.", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80" },
  { id: "travel-resort", name: "Travel & Resort", description: "Destination-driven looks with strong visual storytelling.", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80" },
  { id: "athleisure", name: "Active & Athleisure", description: "Movement-based styling blending sport and lifestyle.", image: "/Outfit_Active.png" },
  { id: "cinematic", name: "Cinematic Signature", description: "High-aesthetic, narrative-driven styling for campaigns.", image: "/Outfit_Cinematic.png" },
  { id: "effortless-chic", name: "Effortless Chic", description: "Relaxed but refined, quiet confidence.", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80" },
  { id: "modern-feminine", name: "Modern Feminine", description: "Soft, elegant, expressive styling.", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80" },
  { id: "bold-statement", name: "Bold Statement", description: "High-contrast, attention-grabbing looks.", image: "/Outfit_Bold.png" },
  { id: "minimal-precision", name: "Minimal Precision", description: "Clean lines, reduced palette, controlled silhouette.", image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80" },
  { id: "urban-edge", name: "Urban Edge", description: "Street-influenced, sharp, directional styling.", image: "/Outfit_UrbanEdge.png" },
];

function loadInProgressProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) {
      const all: Project[] = JSON.parse(raw);
      return all.filter((p) => p.status === "in-progress");
    }
  } catch {}
  return [];
}

function saveProject(project: Project) {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    const all: Project[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([...all, project]));
  } catch {}
}

function getProjectTitle(id: string, fallback: string): string {
  return localStorage.getItem(`project-title-${id}`) ?? fallback;
}

export function HomePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const inProgressProjects = showResumeModal ? loadInProgressProjects() : [];

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSearchQuery("");
    setSelectedTemplate(null);
  };

  const handleCreate = () => {
    if (!selectedTemplate) return;
    const tpl = templates.find((t) => t.id === selectedTemplate);
    const projectName = tpl?.name ?? "New Project";
    const newId = String(Date.now());
    localStorage.setItem(`project-title-${newId}`, projectName);
    saveProject({
      id: newId,
      name: projectName,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      itemCount: 0,
      generatedCount: 0,
      thumbnail: tpl?.image ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      status: "in-progress",
    });
    closeCreateModal();
    setTimeout(() => navigate(`/project/${newId}`), 100);
  };

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
          <img src="/AI_chat.png" alt="AI orb" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
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

      {/* Create New Project Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 relative">
              <button
                onClick={closeCreateModal}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-semibold mb-1">Create New Project</h2>
              <p className="text-gray-500 text-sm">Choose a template that best fits your campaign theme.</p>
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent text-sm"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Escape") closeCreateModal(); }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Choose a Template</p>
              <div className="columns-2 md:columns-3 gap-4">
                {filteredTemplates.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8 w-full">No templates match your search.</p>
                )}
                {filteredTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id === selectedTemplate ? null : tpl.id)}
                    className={`group text-left rounded-xl border-2 overflow-hidden transition-all break-inside-avoid mb-4 w-full ${
                      selectedTemplate === tpl.id
                        ? "border-[#DCB297] shadow-md"
                        : "border-gray-100 hover:border-[#DCB297]/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={tpl.image}
                        alt={tpl.name}
                        className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80";
                        }}
                      />
                      {selectedTemplate === tpl.id && (
                        <div className="absolute inset-0 bg-[#DCB297]/20 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-[#DCB297] flex items-center justify-center shadow-lg">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{tpl.name}</p>
                      <p className="text-xs text-gray-500 leading-snug line-clamp-2">{tpl.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {selectedTemplate
                  ? `Template: ${templates.find((t) => t.id === selectedTemplate)?.name}`
                  : "No template selected"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeCreateModal}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!selectedTemplate}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Project Modal */}
      {showResumeModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowResumeModal(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Resume a Project</h2>
                <p className="text-sm text-gray-500 mt-1">Pick up where you left off.</p>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4 mt-0.5"
              >
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
                inProgressProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 hover:border-[#DCB297] hover:shadow-sm transition-all text-left group"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {getProjectTitle(project.id, project.name)}
                      </p>
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
