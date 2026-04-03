import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Plus, MoreVertical, Calendar, LayoutGrid, List } from "lucide-react";
import { CreateProjectModal, type Project } from "../components/CreateProjectModal";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function getProjectTitle(id: string, fallback: string) {
  return localStorage.getItem(`project-title-${id}`) || fallback;
}

const PROJECTS_KEY = "maistyle-projects";

const NOW = Date.now();
const mockProjects: Project[] = [
  {
    id: "1",
    name: "2025 Fall & Winter Looks",
    date: "March 20, 2026",
    itemCount: 27,
    generatedCount: 150,
    thumbnail: "/Outfit_Summer.jpg",
    status: "in-progress",
    lastEdited: NOW - 2 * 60 * 60 * 1000,
  },
  {
    id: "2",
    name: "Fall / Winter Collection",
    date: "March 15, 2026",
    itemCount: 45,
    generatedCount: 200,
    thumbnail: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    status: "completed",
    lastEdited: NOW - 5 * 24 * 60 * 60 * 1000,
  },
];

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  saveProjects(mockProjects);
  return mockProjects;
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjectsState] = useState<Project[]>(loadProjects);
  const [, forceUpdate] = useState(0);
  const [showDialog, setShowDialog] = useState(() => searchParams.get("create") === "true");
  const [viewMode, setViewMode] = useState<"card" | "list">("list");

  const setProjects = (updater: Project[] | ((prev: Project[]) => Project[])) => {
    setProjectsState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveProjects(next);
      return next;
    });
  };

  useEffect(() => {
    const onFocus = () => forceUpdate(n => n + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleClose = () => {
    setShowDialog(false);
    setSearchParams({});
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-gray-600 mt-1">Create and manage your styling projects</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-md transition-colors ${viewMode === "card" ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {/* Create New Button */}
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

        {/* Card view */}
        {viewMode === "card" && (
          <div className="columns-[280px] gap-5 space-y-0">
            {projects.map(project => (
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
                      onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80"; }}
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={e => e.stopPropagation()} className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    {project.status === "in-progress" && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full border border-white/30">In Progress</span>
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
        )}

        {/* List view */}
        {viewMode === "list" && (
          <div className="flex flex-col gap-2">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="group bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 px-4 py-3"
              >
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80"; }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{getProjectTitle(project.id, project.name)}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    {project.lastEdited && <span>{relativeTime(project.lastEdited)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm flex-shrink-0">
                  <span className="text-gray-500">{project.itemCount} SKU items</span>
                  <span className="font-medium text-[#DCB297]">{project.generatedCount} photos</span>
                  {project.status === "in-progress" && (
                    <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full border border-white/30">In Progress</span>
                  )}
                  <button onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        open={showDialog}
        onClose={handleClose}
        onCreated={project => setProjects(prev => [...prev, project])}
      />
    </div>
  );
}
