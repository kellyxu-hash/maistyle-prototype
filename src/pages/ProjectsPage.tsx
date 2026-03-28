import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, MoreVertical, Calendar } from "lucide-react";

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
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    status: "in-progress",
  },
  {
    id: "2",
    name: "Summer Collection 2026",
    date: "March 15, 2026",
    itemCount: 45,
    generatedCount: 200,
    thumbnail:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
    status: "completed",
  },
];

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newId = String(projects.length + 1);
    setProjects((prev) => [
      ...prev,
      {
        id: newId,
        name: newName.trim(),
        date: "March 28, 2026",
        itemCount: 0,
        generatedCount: 0,
        thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        status: "in-progress",
      },
    ]);
    setShowDialog(false);
    setNewName("");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card */}
          <button
            onClick={() => setShowDialog(true)}
            className="group bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[#DCB297] transition-colors aspect-square flex flex-col items-center justify-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-[#DCB297]/10 flex items-center justify-center transition-colors">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#DCB297]" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">Create New Project</p>
              <p className="text-sm text-gray-500 mt-1">Start styling your SKUs</p>
            </div>
          </button>

          {/* Project Cards */}
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden relative">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 pt-3 pb-3">
                <h3 className="font-semibold text-base mb-1.5 truncate">{project.name}</h3>
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
          ))}
        </div>
      </div>

      {/* Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">Create New Project</h2>
            <p className="text-gray-600 mb-6">Give your project a name to get started</p>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Spring Collection 2026"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent mb-6"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setShowDialog(false);
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowDialog(false); setNewName(""); }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
