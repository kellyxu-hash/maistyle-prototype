import { useState } from "react";
import { Download, Share2, Video, Image as ImageIcon, Heart, Calendar, Filter } from "lucide-react";

interface ExportItem {
  id: string;
  type: "photoshoot" | "vibe" | "video";
  image: string;
  project: string;
  date: string;
  liked: boolean;
}

const mockExports: ExportItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `export-${i}`,
  type: (i % 3 === 0 ? "video" : i % 3 === 1 ? "vibe" : "photoshoot") as "photoshoot" | "vibe" | "video",
  image: `https://images.unsplash.com/photo-${1539109136881 + i * 5000}-67c3616c78ff?w=800`,
  project: i % 2 === 0 ? "2025 Fall & Winter Looks" : "Summer Collection 2026",
  date: `March ${20 - Math.floor(i / 3)}, 2026`,
  liked: i % 4 === 0,
}));

type FilterType = "all" | "photoshoot" | "vibe" | "video";

export function ExportsPage() {
  const [exports] = useState<ExportItem[]>(mockExports);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("all");
  const [showShareModal, setShowShareModal] = useState(false);

  const filtered = exports.filter((item) => filter === "all" || item.type === filter);

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleShareToSocial = (_platform: "instagram" | "tiktok") => {
    setShowShareModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Exports</h1>
            <p className="text-sm text-gray-600 mt-1">All your generated content in one place</p>
          </div>
          {selectedItems.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selectedItems.size} selected</span>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["all", "photoshoot", "vibe", "video"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {f === "all"
                  ? `All (${exports.length})`
                  : f === "photoshoot"
                  ? `Photoshoots (${exports.filter((e) => e.type === "photoshoot").length})`
                  : f === "vibe"
                  ? `Vibe Photos (${exports.filter((e) => e.type === "vibe").length})`
                  : `Videos (${exports.filter((e) => e.type === "video").length})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {selectedItems.size > 0 ? (
              <button onClick={() => setSelectedItems(new Set())} className="text-sm text-gray-600 hover:text-gray-900">
                Deselect all
              </button>
            ) : (
              <button
                onClick={() => setSelectedItems(new Set(filtered.map((i) => i.id)))}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Select all
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleSelection(item.id)}
              className={`group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden cursor-pointer transition-all ${
                selectedItems.has(item.id) ? "ring-4 ring-[#DCB297]" : "hover:shadow-lg"
              }`}
            >
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80";
                }}
              />

              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  {item.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  {item.type === "video" ? "Video" : item.type === "vibe" ? "Vibe" : "Photo"}
                </span>
              </div>

              {/* Selection */}
              <div className="absolute top-3 right-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedItems.has(item.id)
                      ? "bg-[#DCB297] border-[#DCB297]"
                      : "bg-white/30 backdrop-blur-sm border-white opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {selectedItems.has(item.id) && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium truncate mb-1">{item.project}</p>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                    {item.liked && <Heart className="w-4 h-4 fill-white" />}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No exports yet</p>
              <p className="text-sm text-gray-500 mt-1">Generated content will appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">Share to Social Media</h2>
            <p className="text-gray-600 mb-6">
              Share {selectedItems.size} selected {selectedItems.size === 1 ? "item" : "items"} to your social media platforms
            </p>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleShareToSocial("instagram")}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#DCB297] hover:bg-[#DCB297]/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Instagram</p>
                  <p className="text-sm text-gray-600">Share to feed or stories</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#DCB297]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => handleShareToSocial("tiktok")}
                className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#DCB297] hover:bg-[#DCB297]/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">TikTok</p>
                  <p className="text-sm text-gray-600">Post as video content</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-[#DCB297]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Instead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
