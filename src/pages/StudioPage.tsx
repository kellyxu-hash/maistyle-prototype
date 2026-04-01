import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Upload, X, Share2, Send, Plus, Minus, ChevronDown,
  Grid3x3, LayoutList, Download, Heart, Sparkles,
} from "lucide-react";
import { ColorPicker } from "../components/ColorPicker";
import { TypingIndicator } from "../components/TypingIndicator";

type StudioState = "empty" | "model-selection" | "sku-added" | "generating" | "generated" | "preview";
type ContentType = "photoshoots" | "vibe-photos" | "videos";

interface SKUItem { id: string; image: string; category: string; }
interface GeneratedPhoto { id: string; image: string; skuIds: string[]; liked: boolean; }
interface Message { id: string; type: "user" | "ai"; text: string; timestamp: Date; }

// ─── intent analysis ───────────────────────────────────────────────────────
function analyzeIntent(msg: string, state: StudioState, _model: string, _skuCount: number): string {
  const m = msg.toLowerCase();
  if (m.includes("model") || m.includes("change model") || m.includes("different model")) {
    if (m.includes("female") || m.includes("woman")) return "model:female";
    if (m.includes("male") || m.includes("man")) return "model:male";
    return "model:general";
  }
  if (m.includes("generate") || m.includes("create") || m.includes("make"))
    return state === "generated" ? "regenerate" : "generate";
  if (m.includes("refine") || m.includes("improve") || m.includes("better")) return "refine";
  if (m.includes("add more") || m.includes("more items") || m.includes("more sku")) return "add-items";
  if (m.includes("upload") || m.includes("add images") || m.includes("add photos")) return "upload";
  if (m.includes("variation") || m.includes("different") || m.includes("more like")) return "variation";
  if (m.includes("help") || m.includes("how") || m.includes("what can") || m.includes("?")) return "help";
  if (m.includes("export") || m.includes("download") || m.includes("save")) return "export";
  if (m.includes("hi") || m.includes("hello") || m.includes("hey")) return "greeting";
  if (m.includes("thank") || m.includes("great") || m.includes("awesome") || m.includes("perfect")) return "thanks";
  return "general";
}

function generateResponse(intent: string, state: StudioState, _model: string, skuCount: number, genCount: number): string {
  switch (intent) {
    case "model:female": return "Great choice! I'll help you select the Female model. Go to Customize → Models and select Female.";
    case "model:male": return "Perfect! I'll help you select the Male model. Go to Customize → Models and select Male.";
    case "model:general":
      return "Click Customize above → Models to see all available model options.";
    case "generate":
      if (state === "empty" || state === "model-selection")
        return "To generate, I need you to:\n1. Add your SKU images (Upload section)\n2. Click the Generate button!";
      if (state === "sku-added")
        return `You have ${skuCount} SKU items ready. Click the Generate button to create stunning photoshoots! ✨`;
      return "Click the Generate button to create your photoshoots!";
    case "regenerate":
      return `Currently showing ${genCount} photoshoots. Like your favorites ❤️, click any photo to view in detail, or adjust settings and regenerate.`;
    case "refine":
      return state === "generated"
        ? "To refine:\n• Adjust models in Customize → Models\n• Change vibes in Define\n• Add different SKUs in Upload\n\nWhat would you like to refine?"
        : "Generate your first batch, then I can help you refine!";
    case "add-items":
      return "Add more SKU items in the Upload section on the left sidebar!";
    case "upload":
      return skuCount === 0
        ? "Click the Upload section to add your SKU images. You can select multiple images at once!"
        : `You have ${skuCount} SKUs. Click the + button in Upload to add more!`;
    case "variation":
      return state === "generated"
        ? "Click any photo to view it, then I can help create variations with different settings!"
        : "Generate your first batch, then I can create variations!";
    case "help":
      return state === "empty" || state === "model-selection"
        ? "Here's how it works:\n\n1️⃣ Define vibes & colors\n2️⃣ Customize locations & models\n3️⃣ Upload SKU images\n4️⃣ Click Generate!\n\nWhat would you like to start with?"
        : state === "generated"
        ? `You have ${genCount} photoshoots! You can:\n• View in detail (click any photo)\n• Like favorites ❤️\n• Download images\n• Ask me for variations`
        : "I can help with choosing models, uploading SKUs, and generating photoshoots. Just ask!";
    case "export":
      return genCount > 0
        ? `You have ${genCount} photoshoots ready! Download individually or go to the Exports tab to share to Instagram/TikTok.`
        : "Generate photoshoots first, then export them from here or the Exports tab!";
    case "greeting":
      return `Hello! 👋 I'm your AI styling assistant.\n\n${skuCount > 0 ? `You have ${skuCount} SKU items` : "No SKU items yet"}.\n\nWhat would you like to create?`;
    case "thanks":
      return "You're welcome! Let me know if you need anything else 😊";
    default:
      if (state === "empty") return "Let's get started! Define your vibes, then upload SKU images and hit Generate!";
      if (state === "sku-added") return `You have ${skuCount} SKU items ready. Click Generate to create photoshoots!`;
      if (state === "generated") return `Looking good! ${genCount} photoshoots generated. Click any to view, or ask me for variations!`;
      return "I'm here to help! What would you like to do next?";
  }
}

// ─── mock data ──────────────────────────────────────────────────────────────
const mockSKUs: SKUItem[] = [
  { id: "1", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", category: "jacket" },
  { id: "2", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", category: "jacket" },
  { id: "3", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", category: "jacket" },
  { id: "4", image: "https://images.unsplash.com/photo-1525450824097-4387ce5d40d0?w=400", category: "jacket" },
  { id: "5", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400", category: "sweater" },
  { id: "6", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400", category: "sweater" },
  { id: "7", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400", category: "sweater" },
  { id: "8", image: "https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=400", category: "sweater" },
  { id: "9", image: "https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400", category: "pants" },
  { id: "10", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400", category: "pants" },
  { id: "11", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", category: "pants" },
  { id: "12", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400", category: "pants" },
];

// Fashion model photos using Unsplash
const femaleModelPhotos: GeneratedPhoto[] = [
  { id: "f1", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800", skuIds: ["1"], liked: false },
  { id: "f2", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800", skuIds: ["2"], liked: false },
  { id: "f3", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800", skuIds: ["3"], liked: false },
  { id: "f4", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800", skuIds: ["4"], liked: false },
];

const maleModelPhotos: GeneratedPhoto[] = [
  { id: "m1", image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800", skuIds: ["1"], liked: false },
  { id: "m2", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800", skuIds: ["2"], liked: false },
  { id: "m3", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800", skuIds: ["3"], liked: false },
  { id: "m4", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", skuIds: ["4"], liked: false },
  { id: "m5", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800", skuIds: ["5"], liked: false },
  { id: "m6", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800", skuIds: ["6"], liked: false },
];

const defaultGeneratedPhotos: GeneratedPhoto[] = Array.from({ length: 12 }, (_, i) => ({
  id: `gen-${i}`,
  image: `https://images.unsplash.com/photo-${1539109136881 + i * 10000}-67c3616c78ff?w=800`,
  skuIds: [String((i % 12) + 1)],
  liked: false,
}));

// ─── component ──────────────────────────────────────────────────────────────
export function StudioPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const storageKey = `project-title-${projectId}`;
  const savedTitle = projectId ? localStorage.getItem(storageKey) : null;
  const [projectTitle, setProjectTitle] = useState(savedTitle ?? "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.select();
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    const trimmed = projectTitle.trim();
    const final = trimmed || "";
    setProjectTitle(final);
    if (projectId) localStorage.setItem(storageKey, final);
    setIsEditingTitle(false);
  };

  const [state, setState] = useState<StudioState>("empty");
  const [selectedModel, setSelectedModel] = useState("");
  const [skus, setSKUs] = useState<SKUItem[]>([]);
  const [generatedPhotos, setGeneratedPhotos] = useState<GeneratedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GeneratedPhoto | null>(null);
  const [contentType, setContentType] = useState<ContentType>("photoshoots");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sidebar accordion
  const [openSection, setOpenSection] = useState<"define" | "customize" | "upload" | null>("define");

  // Define section
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const vibes = ["Elegant", "Casual", "Street", "Minimal", "Vintage", "Modern"];

  // Colors
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#2B2C30");
  const colorPickerTriggerRef = useRef<HTMLButtonElement>(null);
  const predefinedColors = [
    { name: "Black", hex: "#000000" },
    { name: "Teal", hex: "#408D9E" },
    { name: "Dark", hex: "#2B2C30" },
    { name: "Brown1", hex: "#8B6F5C" },
    { name: "Brown2", hex: "#B8997D" },
    { name: "Brown3", hex: "#C9B8A8" },
  ];

  // Customize section
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState("50");
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const locations = ["Studio", "Street", "Beach", "Urban", "Nature", "Indoor"];
  const formatOptions = ["Photoshoots", "Vibe photos", "Videos"];
  const quantityOptions = ["50", "200", "500"];

  const modelOptions = [
    { name: "Female", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200" },
    { name: "Male", image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=200" },
  ];

  // Upload/drag
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Chat
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "ai", text: "Hi, I'm your AI styling assistant 👋 What are you envisioning?", timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── handlers ─────────────────────────────────────────────────────────────
  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = { id: String(Date.now()), type: "user", text: inputText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    const captured = inputText;
    setInputText("");
    setIsTyping(true);
    setTimeout(() => {
      const intent = analyzeIntent(captured, state, selectedModel, skus.length);
      const response = generateResponse(intent, state, selectedModel, skus.length, generatedPhotos.length);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), type: "ai", text: response, timestamp: new Date() },
      ]);
    }, 800);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const uploaded: SKUItem[] = [];
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const ts = Date.now();
    arr.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        uploaded.push({ id: `upload-${ts}-${i}`, image: e.target?.result as string, category: "uploaded" });
        if (uploaded.length === arr.length) {
          setSKUs(uploaded);
          setState("sku-added");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = () => {
    if (skus.length === 0 || isGenerating) return;
    setIsGenerating(true);
    setState("generating");
    setGenerationProgress(0);

    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), type: "ai", text: "✨ Starting AI generation... Creating photoshoots with your SKUs!", timestamp: new Date() },
    ]);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      setIsGenerating(false);
      setState("generated");
      let photos: GeneratedPhoto[];
      if (selectedModels.includes("Male") && selectedModels.includes("Female")) {
        photos = [...maleModelPhotos, ...femaleModelPhotos];
      } else if (selectedModels.includes("Male")) {
        photos = maleModelPhotos;
      } else if (selectedModels.includes("Female")) {
        photos = femaleModelPhotos;
      } else {
        photos = defaultGeneratedPhotos;
      }
      setGeneratedPhotos(photos);
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), type: "ai", text: `🎉 Done! Generated ${photos.length} unique photoshoots. Click any to view or refine!`, timestamp: new Date() },
      ]);
    }, 3000);
  };

  const handleLike = (id: string) => {
    setGeneratedPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked } : p)));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/projects")} className="p-1 hover:bg-gray-100 rounded">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") handleTitleBlur(); }}
              className="text-base font-semibold bg-transparent border-b border-gray-400 outline-none min-w-[160px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className={`text-base font-semibold cursor-text hover:opacity-70 transition-opacity ${!projectTitle ? "text-gray-400 font-normal" : ""}`}
            >
              {projectTitle || "Untitled project"}
            </span>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ── Left Sidebar ── */}
        <div className="w-[345px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="flex-1 overflow-auto p-4 space-y-4">

            {/* 1 · Define */}
            <div className="border-b border-gray-200 pb-1">
              <button
                onClick={() => setOpenSection(openSection === "define" ? null : "define")}
                className="w-full flex items-center gap-3 mb-3"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#DCB297] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[#DCB297]">1</span>
                </div>
                <span className="text-[15px] font-semibold text-[#DCB297] flex-1 text-left">Define</span>
                {openSection === "define" ? <Minus className="w-4 h-4 text-gray-600" /> : <Plus className="w-4 h-4 text-gray-600" />}
              </button>

              {openSection === "define" && (
                <div className="ml-9">
                  {/* Vibes */}
                  <p className="text-xs font-bold text-[#818d9c] mb-3">Vibes</p>
                  <div className="flex flex-wrap gap-2 pb-5">
                    {vibes.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVibes(toggle(selectedVibes, v))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedVibes.includes(v) ? "bg-[#DCB297] text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>

                  {/* Colors */}
                  <p className="text-xs font-bold text-[#818d9c] mb-2">Colors</p>
                  <div className="flex flex-wrap gap-2 pb-5">
                    <button
                      ref={colorPickerTriggerRef}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        showColorPicker ? "border-indigo-500" : "border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                    {predefinedColors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColors(toggle(selectedColors, c.hex))}
                        className={`w-6 h-6 rounded-full transition-all ${
                          selectedColors.includes(c.hex)
                            ? "ring-2 ring-offset-1 ring-indigo-500"
                            : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    {customColors.map((c, i) => (
                      <button
                        key={`custom-${i}`}
                        onClick={() => setSelectedColors(toggle(selectedColors, c))}
                        className={`w-6 h-6 rounded-full transition-all ${
                          selectedColors.includes(c)
                            ? "ring-2 ring-offset-1 ring-indigo-500"
                            : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <ColorPicker
                    isOpen={showColorPicker}
                    onClose={() => setShowColorPicker(false)}
                    onColorSelect={(c) => {
                      if (!customColors.includes(c)) setCustomColors((prev) => [...prev, c]);
                      if (!selectedColors.includes(c)) setSelectedColors((prev) => [...prev, c]);
                    }}
                    currentColor={currentColor}
                    setCurrentColor={setCurrentColor}
                    triggerRef={colorPickerTriggerRef as React.RefObject<HTMLElement>}
                  />
                </div>
              )}
            </div>

            {/* 2 · Customize */}
            <div className="border-b border-gray-200 pb-1">
              <button
                onClick={() => setOpenSection(openSection === "customize" ? null : "customize")}
                className="w-full flex items-center gap-3 mb-3"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#DCB297] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[#DCB297]">2</span>
                </div>
                <span className="text-[15px] font-semibold text-[#DCB297] flex-1 text-left">Customize</span>
                {openSection === "customize" ? <Minus className="w-4 h-4 text-gray-600" /> : <Plus className="w-4 h-4 text-gray-600" />}
              </button>

              {openSection === "customize" && (
                <div className="ml-9 space-y-4 pb-5">
                  {/* Locations */}
                  <div>
                    <p className="text-xs font-bold text-[#818d9c] mb-2">Locations</p>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setSelectedLocations(toggle(selectedLocations, loc))}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedLocations.includes(loc) ? "bg-[#DCB297] text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <p className="text-xs font-bold text-[#818d9c] mb-2">Format</p>
                    <div className="flex flex-wrap gap-2">
                      {formatOptions.map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setSelectedFormats(toggle(selectedFormats, fmt))}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedFormats.includes(fmt) ? "bg-[#DCB297] text-white" : "bg-gray-100 hover:bg-gray-200 text-black"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="relative">
                    <p className="text-xs font-bold text-[#818d9c] mb-2">Quantity</p>
                    <button
                      onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-all"
                    >
                      <span>{selectedQuantity}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showQuantityDropdown ? "rotate-180" : ""}`} />
                    </button>
                    {showQuantityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                        {quantityOptions.map((qty) => (
                          <button
                            key={qty}
                            onClick={() => { setSelectedQuantity(qty); setShowQuantityDropdown(false); }}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                              selectedQuantity === qty ? "bg-[#DCB297]/10 text-[#DCB297] font-medium" : ""
                            }`}
                          >
                            {qty}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Models */}
                  <div>
                    <p className="text-xs font-bold text-[#818d9c] mb-2">Models</p>
                    <div className="flex gap-4">
                      {modelOptions.map((model) => (
                        <button
                          key={model.name}
                          onClick={() => {
                            setSelectedModels(toggle(selectedModels, model.name));
                            setSelectedModel(model.name);
                            setState("model-selection");
                          }}
                          className={`relative rounded-xl overflow-hidden transition-all ${
                            selectedModels.includes(model.name)
                              ? "ring-2 ring-[#DCB297]"
                              : "ring-1 ring-gray-200 hover:ring-gray-300"
                          }`}
                          style={{ width: 80, height: 100 }}
                        >
                          <img
                            src={model.image}
                            alt={model.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                            {model.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3 · Upload */}
            <div>
              <button
                onClick={() => setOpenSection(openSection === "upload" ? null : "upload")}
                className="w-full flex items-center gap-3 mb-3"
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#DCB297] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[#DCB297]">3</span>
                </div>
                <span className="text-[15px] font-semibold text-[#DCB297] flex-1 text-left">
                  Upload {skus.length > 0 && `(${skus.length})`}
                </span>
                {openSection === "upload" ? <Minus className="w-4 h-4 text-gray-600" /> : <Plus className="w-4 h-4 text-gray-600" />}
              </button>

              {openSection === "upload" && (
                <div className="ml-9">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />

                  {skus.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files); }}
                      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        isDragging ? "border-[#DCB297] bg-[#DCB297]/10" : "border-[#787878] bg-[#f8f8f8] hover:border-[#DCB297] hover:bg-gray-50"
                      }`}
                    >
                      <Upload className="w-10 h-10 text-gray-400 opacity-50" />
                      <div className="text-center">
                        <p className="font-medium text-[#2c2d30] mb-1 text-sm">
                          {isDragging ? "Drop your SKU images here" : "Drag your SKU images here"}
                        </p>
                        <p className="text-xs text-[#747781]">or, browse to select images</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#DCB297] hover:bg-gray-50 flex items-center justify-center transition-all"
                      >
                        <Plus className="w-6 h-6 text-gray-400" />
                      </button>
                      {skus.map((sku) => (
                        <div
                          key={sku.id}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-[#DCB297] cursor-pointer relative group transition-colors"
                        >
                          <img
                            src={sku.image}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200";
                            }}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const next = skus.filter((s) => s.id !== sku.id);
                              setSKUs(next);
                              if (next.length === 0) setState("empty");
                            }}
                            className="absolute top-1 right-1 bg-black/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick-add mock SKUs */}
                  {skus.length === 0 && (
                    <button
                      onClick={() => { setSKUs(mockSKUs); setState("sku-added"); }}
                      className="mt-3 w-full text-xs text-[#DCB297] hover:underline text-center py-1"
                    >
                      + Add sample SKUs for demo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="border-t border-gray-200 px-4 py-4">
            <button
              onClick={handleGenerate}
              disabled={skus.length === 0 || isGenerating}
              className={`w-full py-3 rounded-full font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                skus.length > 0 && !isGenerating
                  ? "bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white hover:opacity-90"
                  : "bg-[#f1f1f1] text-black/30 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                `Generating ${generationProgress}%`
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Center Content ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Content type tabs */}
          {generatedPhotos.length > 0 && (
            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex gap-4">
                {(["photoshoots", "vibe-photos", "videos"] as ContentType[]).map((ct) => (
                  <button
                    key={ct}
                    onClick={() => setContentType(ct)}
                    className={`pb-2 px-1 font-medium text-[13px] tracking-[-0.14px] ${
                      contentType === ct ? "text-black border-b-2 border-black" : "text-black/30"
                    }`}
                  >
                    {ct === "photoshoots" ? "Photoshoots" : ct === "vibe-photos" ? "Vibe photos" : "Videos"}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded ${viewMode === "grid" ? "bg-black text-white" : ""}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded ${viewMode === "list" ? "bg-black text-white" : ""}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main area */}
          <div className="flex-1 overflow-auto p-5">
            {state === "preview" && selectedPhoto ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-gray-100 rounded-xl overflow-hidden relative">
                  <img src={selectedPhoto.image} alt="" className="w-full h-full object-contain" />
                  <button
                    onClick={() => setState("generated")}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto py-2">
                  {generatedPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`flex-none w-16 h-20 rounded-lg overflow-hidden ${
                        photo.id === selectedPhoto.id ? "ring-2 ring-[#DCB297]" : ""
                      }`}
                    >
                      <img src={photo.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : generatedPhotos.length > 0 ? (
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {generatedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => { setSelectedPhoto(photo); setState("preview"); }}
                  >
                    <img
                      src={photo.image}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleLike(photo.id); }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white"
                        >
                          <Heart className={`w-4 h-4 ${photo.liked ? "fill-red-500 text-red-500" : ""}`} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <div className="w-48 h-48 mx-auto mb-6 opacity-60">
                    <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                      <rect x="40" y="20" width="120" height="160" rx="8" fill="#f0f0f0" stroke="#ddd" strokeWidth="2"/>
                      <rect x="55" y="35" width="90" height="90" rx="4" fill="#e0e0e0"/>
                      <rect x="55" y="135" width="60" height="8" rx="4" fill="#e0e0e0"/>
                      <rect x="55" y="150" width="40" height="8" rx="4" fill="#e8d5c4"/>
                      <circle cx="160" cy="140" r="24" fill="#DCB297"/>
                      <path d="M160 128v24M148 140h24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="text-[#747781] text-sm">
                    Photoshoot images are models against plain backgrounds, ideal for e-commerce.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Add SKU items and click Generate to get started.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── AI Chat ── */}
          <div className="border-t border-gray-200">
            {/* AI label */}
            <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-100">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E5B290] to-[#DCB297] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">AI Assistant</span>
            </div>

            {/* Messages */}
            <div className="max-h-[80px] overflow-y-auto space-y-1 px-3 py-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 items-start ${msg.type === "user" ? "justify-end" : ""}`}
                >
                  <div
                    className={`rounded-xl max-w-3xl whitespace-pre-line text-[13px] px-3 py-1 ${
                      msg.type === "ai" ? "text-gray-900" : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-start px-3 py-1">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4">
              <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded-full p-2 z-10">
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={state === "generated" ? "Ask me to refine or create more..." : "Type here..."}
                    className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent rounded-full pl-12 pr-4 py-2"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-3"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
