import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Plus, MoreVertical, Calendar, Search, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  generatedCount: number;
  thumbnail: string;
  status: "in-progress" | "completed";
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "2025 Fall & Winter Looks",
    date: "March 20, 2026",
    itemCount: 27,
    generatedCount: 150,
    thumbnail:
      "/Outfit_Summer.jpg",
    status: "in-progress",
  },
  {
    id: "2",
    name: "Fall / Winter Collection",
    date: "March 15, 2026",
    itemCount: 45,
    generatedCount: 200,
    thumbnail: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    status: "completed",
  },
];

const templates = [
  {
    id: "spring-summer",
    name: "Spring / Summer Collection",
    description: "Fresh, breathable, vibrant looks for warm, active seasons.",
    image: "/Outfit_Summer.jpg",
  },
  {
    id: "fall-winter",
    name: "Fall / Winter Collection",
    description: "Layered, textured, structured looks for colder, richer seasons.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
  },
  {
    id: "everyday",
    name: "Everyday Look",
    description: "Clean, polished daily outfits with effortless style.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  },
  {
    id: "weekend-brunch",
    name: "Weekend & Brunch",
    description: "Relaxed, social daytime looks with warmth and ease.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  },
  {
    id: "date-night",
    name: "Date Night & Evening",
    description: "Emotional, refined looks for intimate or social evenings.",
    image: "/Outfit_Night.png",
  },
  {
    id: "workwear",
    name: "Modern Workwear",
    description: "Structured, confident outfits for professional environments.",
    image: "/Outfit_BusinessCasual.png",
  },
  {
    id: "smart-casual",
    name: "Smart Casual Transition",
    description: "From office to after-work, flexible and adaptive styling.",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  },
  {
    id: "travel-resort",
    name: "Travel & Resort",
    description: "Destination-driven looks with strong visual storytelling.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  },
  {
    id: "athleisure",
    name: "Active & Athleisure",
    description: "Movement-based styling blending sport and lifestyle.",
    image: "/Outfit_Active.png",
  },
  {
    id: "cinematic",
    name: "Cinematic Signature",
    description: "High-aesthetic, narrative-driven styling for campaigns.",
    image: "/Outfit_Cinematic.png",
  },
  {
    id: "effortless-chic",
    name: "Effortless Chic",
    description: "Relaxed but refined, quiet confidence.",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  },
  {
    id: "modern-feminine",
    name: "Modern Feminine",
    description: "Soft, elegant, expressive styling.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
  },
  {
    id: "bold-statement",
    name: "Bold Statement",
    description: "High-contrast, attention-grabbing looks.",
    image: "/Outfit_Bold.png",
  },
  {
    id: "minimal-precision",
    name: "Minimal Precision",
    description: "Clean lines, reduced palette, controlled silhouette.",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80",
  },
  {
    id: "urban-edge",
    name: "Urban Edge",
    description: "Street-influenced, sharp, directional styling.",
    image: "/Outfit_UrbanEdge.png",
  },
];

function getProjectTitle(id: string, fallback: string) {
  return localStorage.getItem(`project-title-${id}`) || fallback;
}

const PROJECTS_KEY = "maistyle-projects";

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return mockProjects;
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjectsState] = useState<Project[]>(loadProjects);
  const [, forceUpdate] = useState(0);

  const setProjects = (updater: Project[] | ((prev: Project[]) => Project[])) => {
    setProjectsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveProjects(next);
      return next;
    });
  };

  useEffect(() => {
    const onFocus = () => forceUpdate((n) => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);
  const [showDialog, setShowDialog] = useState(() => searchParams.get("create") === "true");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeDialog = () => {
    const fromHome = searchParams.get("from") === "home";
    setShowDialog(false);
    setSearchQuery("");
    setSelectedTemplate(null);
    if (fromHome) {
      navigate("/");
    } else {
      setSearchParams({});
    }
  };

  const handleCreate = () => {
    if (!selectedTemplate) return;
    const tpl = templates.find((t) => t.id === selectedTemplate);
    const projectName = tpl?.name ?? "New Project";
    const newId = String(Date.now());
    // Seed the title in localStorage so StudioPage shows it immediately
    localStorage.setItem(`project-title-${newId}`, projectName);
    setProjects((prev) => [
      ...prev,
      {
        id: newId,
        name: projectName,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        itemCount: 0,
        generatedCount: 0,
        thumbnail: tpl?.image ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        status: "in-progress",
      },
    ]);
    closeDialog();
    setTimeout(() => navigate(`/project/${newId}`), 100);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-gray-600 mt-1">Create and manage your styling projects</p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-8">
        {/* Create New Button — full width row above masonry */}
        <button
          onClick={() => setShowDialog(true)}
          className="group w-full bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#DCB297] transition-colors h-24 flex items-center justify-center gap-4 mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#DCB297]/10 flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#DCB297]" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Create New Project</p>
            <p className="text-sm text-gray-500">Start styling your SKUs</p>
          </div>
        </button>

        {/* Masonry columns */}
        <div className="columns-[280px] gap-5 space-y-0">
          {/* Project Cards */}
          {projects.map((project) => (
            <div key={project.id} className="break-inside-avoid pb-5">
            <div
              onClick={() => navigate(`/project/${project.id}`)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80";
                  }}
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                {project.status === "in-progress" && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full border border-white/30">
                      In Progress
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 pt-3 pb-3">
                <h3 className="font-semibold text-base mb-1.5 truncate">{getProjectTitle(project.id, project.name)}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{project.itemCount} SKU items</span>
                  <span className="font-medium text-[#DCB297]">{project.generatedCount} photos</span>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={(e) => { if (e.target === e.currentTarget) closeDialog(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 border-b border-gray-100 relative">
              <button
                onClick={closeDialog}
                className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                  onKeyDown={(e) => { if (e.key === "Escape") closeDialog(); }}
                />
              </div>
            </div>

            {/* Template Gallery */}
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

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {selectedTemplate
                  ? `Template: ${templates.find((t) => t.id === selectedTemplate)?.name}`
                  : "No template selected"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeDialog}
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
    </div>
  );
}
