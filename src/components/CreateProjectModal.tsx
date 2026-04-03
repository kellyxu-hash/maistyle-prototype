import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, X, Check, ImageIcon, Video } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  date: string;
  itemCount: number;
  generatedCount: number;
  thumbnail: string;
  status: "in-progress" | "completed";
  lastEdited?: number;
}

export const templates = [
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

const STEPS = [
  { num: 1 as const, label: "Describe project" },
  { num: 2 as const, label: "Set requirements" },
  { num: 3 as const, label: "Choose models" },
];

const MODELS = [
  { id: "model-f1", name: "Mia 1", style: "Heels & Chic", image: "/Models/woman-black-heels-latest.jpeg", gender: "female" as const },
  { id: "model-f2", name: "Mia 2", style: "Clean & Elegant", image: "/Models/woman-white-heels-latest.jpeg", gender: "female" as const },
  { id: "model-f3", name: "Mia 3", style: "Urban & Street", image: "/Models/woman-black-sneaker-latest.jpeg", gender: "female" as const },
  { id: "model-f4", name: "Mia 4", style: "Fresh & Casual", image: "/Models/woman-white-sneaker-latest.jpeg", gender: "female" as const },
  { id: "model-m1", name: "Leo 1", style: "Sharp & Formal", image: "/Models/man_black_leather_new.jpeg", gender: "male" as const },
  { id: "model-m2", name: "Leo 2", style: "Clean & Casual", image: "/Models/man_white_sneaker_new.png", gender: "male" as const },
  { id: "model-m3", name: "Leo 3", style: "Urban & Cool", image: "/Models/man_black_sneaker_new.png", gender: "male" as const },
  { id: "model-m4", name: "Leo 4", style: "Classic & Bold", image: "/Models/man_black_leather_shoes_new.jpg", gender: "male" as const },
];

const USE_CASES = ["Lookbooks", "E-commerce assets", "Marketing campaigns", "Social media content", "Brand campaigns"];
const OUTPUT_TYPES = [
  { id: "Model try-on", label: "Model try-on", image: "/OutputType_Tryon.jpg", icon: "image" as const },
  { id: "Specific poses", label: "Specific poses", image: "/OutputType_Pose.jpg", icon: "image" as const },
  { id: "Vibe images", label: "Vibe images", image: "/OutputType_Vibe.jpg", icon: "image" as const },
  { id: "Cinematic videos", label: "Cinematic videos", image: "/OutputType_Video.png", icon: "video" as const },
];
const RESOLUTIONS = ["Standard (1080p)", "High (2K)", "Ultra (4K)"];
const PROJECTS_KEY = "maistyle-projects";

function getAspectRatioOptions(outputTypes: string[]): string[] {
  const opts = new Set<string>();
  if (outputTypes.includes("Cinematic videos")) ["16:9", "21:9", "9:16"].forEach(o => opts.add(o));
  if (outputTypes.includes("Model try-on") || outputTypes.includes("Specific poses")) ["3:4", "4:5", "2:3"].forEach(o => opts.add(o));
  if (outputTypes.includes("Vibe images")) ["1:1", "4:5", "16:9", "9:16"].forEach(o => opts.add(o));
  if (opts.size === 0) ["1:1", "4:5", "3:4", "9:16", "16:9"].forEach(o => opts.add(o));
  return Array.from(opts);
}

function saveProjectToStorage(project: Project) {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    const all: Project[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([...all, project]));
  } catch {}
}

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (project: Project) => void;
}

export function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [selectedOutputTypes, setSelectedOutputTypes] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("");
  const [resolution, setResolution] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const reset = () => {
    setStep(1);
    setSearchQuery("");
    setSelectedTemplate(null);
    setSelectedUseCases([]);
    setSelectedOutputTypes([]);
    setAspectRatio("");
    setResolution("");
    setSelectedModels([]);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleCreate = () => {
    if (!selectedTemplate) return;
    const tpl = templates.find(t => t.id === selectedTemplate);
    const projectName = tpl?.name ?? "New Project";
    const newId = String(Date.now());
    const newProject: Project = {
      id: newId,
      name: projectName,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      itemCount: 0,
      generatedCount: 0,
      thumbnail: tpl?.image ?? "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      status: "in-progress",
      lastEdited: Date.now(),
    };
    localStorage.setItem(`project-title-${newId}`, projectName);
    // Save full project config for display in StudioPage
    const config = {
      template: { id: tpl!.id, name: tpl!.name, image: tpl!.image },
      useCases: selectedUseCases,
      outputTypes: selectedOutputTypes,
      aspectRatio,
      resolution,
      models: MODELS.filter(m => selectedModels.includes(m.id)).map(m => ({ id: m.id, name: m.name, gender: m.gender, image: m.image })),
    };
    localStorage.setItem(`project-config-${newId}`, JSON.stringify(config));
    saveProjectToStorage(newProject);
    onCreated?.(newProject);
    reset();
    onClose();
    setTimeout(() => navigate(`/project/${newId}`), 100);
  };

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh]">

        {/* ── Persistent Header ── */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Create New Project</h2>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step progress bar — each step gets flex-1 so circle centers are at 1/6, 3/6, 5/6 */}
          <div className="relative flex items-start">
            {/* Background line: from center of step 1 (1/6) to center of step 3 (5/6) */}
            <div className="absolute top-4 h-0.5 bg-gray-200" style={{ left: "calc(100%/6)", right: "calc(100%/6)" }} />
            {/* Filled line */}
            <div
              className="absolute top-4 h-0.5 bg-[#DCB297] transition-all duration-300"
              style={{
                left: "calc(100%/6)",
                width: step === 1 ? "0%" : step === 2 ? "calc(100%/3)" : "calc(100%*2/3)",
              }}
            />
            {STEPS.map(s => (
              <div key={s.num} className="flex-1 relative flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                    step > s.num
                      ? "bg-[#DCB297] border-[#DCB297] text-white"
                      : step === s.num
                      ? "bg-[#DCB297] border-[#DCB297] text-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs whitespace-nowrap ${step === s.num ? "text-gray-700 font-semibold" : step > s.num ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Step 1: Describe Project ── */}
        {step === 1 && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Choose a Theme</p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search themes..."
                    className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent text-sm w-52"
                    autoFocus
                    onKeyDown={e => { if (e.key === "Escape") handleClose(); }}
                  />
                </div>
              </div>
              <div className="columns-2 md:columns-3 gap-4">
                {filteredTemplates.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8 w-full">No themes match your search.</p>
                )}
                {filteredTemplates.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id === selectedTemplate ? null : tpl.id)}
                    className={`group text-left rounded-xl border-2 overflow-hidden transition-all break-inside-avoid mb-4 w-full ${
                      selectedTemplate === tpl.id ? "border-[#DCB297] shadow-md" : "border-gray-100 hover:border-[#DCB297]/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={tpl.image}
                        alt={tpl.name}
                        className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80"; }}
                      />
                      {selectedTemplate === tpl.id && (
                        <div className="absolute inset-0 bg-[#DCB297]/20 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-[#DCB297] flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 text-white" />
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
                {selectedTemplate ? `Theme: ${templates.find(t => t.id === selectedTemplate)?.name}` : "No theme selected"}
              </p>
              <div className="flex gap-3">
                <button onClick={handleClose} className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedTemplate}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Step 2: Set Requirements ── */}
        {step === 2 && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Use Cases</p>
                <div className="flex flex-wrap gap-2">
                  {USE_CASES.map(uc => (
                    <button
                      key={uc}
                      onClick={() => toggleItem(selectedUseCases, setSelectedUseCases, uc)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedUseCases.includes(uc) ? "bg-[#DCB297] border-[#DCB297] text-white" : "border-gray-200 text-gray-600 hover:border-[#DCB297]/60"
                      }`}
                    >
                      {uc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Output Types</p>
                <div className="grid grid-cols-4 gap-3">
                  {OUTPUT_TYPES.map(ot => {
                    const selected = selectedOutputTypes.includes(ot.id);
                    return (
                      <button
                        key={ot.id}
                        onClick={() => { toggleItem(selectedOutputTypes, setSelectedOutputTypes, ot.id); setAspectRatio(""); }}
                        className={`group relative rounded-xl border-2 overflow-hidden transition-all text-left ${
                          selected ? "border-[#DCB297] shadow-md" : "border-gray-100 hover:border-[#DCB297]/50 hover:shadow-sm"
                        }`}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={ot.image}
                            alt={ot.label}
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80"; }}
                          />
                          {selected && (
                            <div className="absolute inset-0 bg-[#DCB297]/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-[#DCB297] flex items-center justify-center shadow-lg">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-2 flex items-center gap-1.5">
                          {ot.icon === "video"
                            ? <Video className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? "text-[#DCB297]" : "text-gray-400"}`} />
                            : <ImageIcon className={`w-3.5 h-3.5 flex-shrink-0 ${selected ? "text-[#DCB297]" : "text-gray-400"}`} />
                          }
                          <p className={`text-xs font-semibold leading-tight ${selected ? "text-[#DCB297]" : "text-gray-700"}`}>{ot.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Technical Specs</p>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                    <select
                      value={aspectRatio}
                      onChange={e => setAspectRatio(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent text-gray-700"
                    >
                      <option value="">Select aspect ratio…</option>
                      {getAspectRatioOptions(selectedOutputTypes).map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <select
                      value={resolution}
                      onChange={e => setResolution(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent text-gray-700"
                    >
                      <option value="">Select resolution…</option>
                      {RESOLUTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">Theme: {templates.find(t => t.id === selectedTemplate)?.name}</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedUseCases.length === 0 || selectedOutputTypes.length === 0 || !aspectRatio || !resolution}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Step 3: Choose Models ── */}
        {step === 3 && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              <div className="flex justify-end">
                <span className="text-xs text-gray-400">{selectedModels.length} selected</span>
              </div>
              {(["female", "male"] as const).map(gender => {
                const group = MODELS.filter(m => m.gender === gender);
                return (
                  <div key={gender}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                      {gender === "female" ? "Female Models" : "Male Models"}
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {group.map(model => (
                        <button
                          key={model.id}
                          onClick={() => toggleItem(selectedModels, setSelectedModels, model.id)}
                          className={`group text-left rounded-xl border-2 overflow-hidden transition-all ${
                            selectedModels.includes(model.id) ? "border-[#DCB297] shadow-md" : "border-gray-100 hover:border-[#DCB297]/50 hover:shadow-sm"
                          }`}
                        >
                          <div className="relative overflow-hidden">
                            <img
                              src={model.image}
                              alt={model.name}
                              className="w-full h-auto block group-hover:scale-105 transition-transform duration-300"
                              onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80"; }}
                            />
                            {selectedModels.includes(model.id) && (
                              <div className="absolute inset-0 bg-[#DCB297]/20 flex items-center justify-center">
                                <div className="w-7 h-7 rounded-full bg-[#DCB297] flex items-center justify-center shadow-lg">
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold text-gray-900">{model.name}</p>
                            <p className="text-xs text-gray-500">{model.style}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">Theme: {templates.find(t => t.id === selectedTemplate)?.name}</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">Back</button>
                <button
                  onClick={handleCreate}
                  disabled={selectedModels.length === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Create Project
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
