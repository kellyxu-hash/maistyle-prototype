import { useState } from "react";
import { Sparkles, Globe, Upload, X } from "lucide-react";

interface BrandData {
  name: string;
  website: string;
  description: string;
  targetAudience: string;
  aestheticKeywords: string[];
  colorPalette: string[];
  referenceImages: string[];
}

export function BrandPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanModal, setShowScanModal] = useState(false);
  const [tempKeyword, setTempKeyword] = useState("");
  const [brandData, setBrandData] = useState<BrandData>({
    name: "",
    website: "",
    description: "",
    targetAudience: "",
    aestheticKeywords: [],
    colorPalette: ["#E5B290", "#DCB297", "#2C2D30", "#F8F8F8", "#787878"],
    referenceImages: [],
  });

  const handleScan = () => {
    if (!brandData.website) return;
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setIsScanning(false);
      setBrandData((prev) => ({
        ...prev,
        name: "Your Brand Name",
        description: "A modern fashion brand focused on sustainable and timeless pieces that blend contemporary design with classic silhouettes.",
        targetAudience: "Urban professionals aged 25-40 who value quality and sustainability",
        aestheticKeywords: ["Minimalist", "Sustainable", "Contemporary", "Timeless", "Urban"],
      }));
      setShowScanModal(false);
    }, 2500);
  };

  const addKeyword = () => {
    const kw = tempKeyword.trim();
    if (kw && !brandData.aestheticKeywords.includes(kw)) {
      setBrandData((prev) => ({ ...prev, aestheticKeywords: [...prev.aestheticKeywords, kw] }));
      setTempKeyword("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Brand DNA</h1>
            <p className="text-sm text-gray-600 mt-1">Define your brand identity to power AI-generated content</p>
          </div>
          <button
            onClick={() => setShowScanModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-5 h-5" />
            Scan Website
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          {/* AI Card */}
          <div className="bg-gradient-to-r from-[#E5B290]/10 to-[#DCB297]/10 border border-[#DCB297]/20 rounded-xl p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5B290] to-[#DCB297] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Brand Analysis</h3>
                <p className="text-sm text-gray-700 mb-3">
                  I can automatically scan your website to extract brand guidelines, color palettes, and aesthetic preferences. This helps create content that perfectly matches your brand identity.
                </p>
                <button
                  onClick={() => setShowScanModal(true)}
                  className="text-sm font-medium text-[#DCB297] hover:underline"
                >
                  Start Website Scan →
                </button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name</label>
                <input
                  type="text"
                  value={brandData.name}
                  onChange={(e) => setBrandData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Enter your brand name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={brandData.website}
                      onChange={(e) => setBrandData((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://yourbrand.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={!brandData.website || isScanning}
                    className="px-4 py-2.5 bg-[#DCB297] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isScanning ? "Scanning..." : "Auto-fill"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Brand Description</label>
                <textarea
                  value={brandData.description}
                  onChange={(e) => setBrandData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your brand's mission, values, and unique selling points..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Audience</label>
                <input
                  type="text"
                  value={brandData.targetAudience}
                  onChange={(e) => setBrandData((p) => ({ ...p, targetAudience: e.target.value }))}
                  placeholder="e.g., Urban professionals aged 25-40"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Aesthetic & Style */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Aesthetic & Style</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tempKeyword}
                    onChange={(e) => setTempKeyword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                    placeholder="Add aesthetic keywords (e.g., Minimalist, Bold, Vintage)"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {brandData.aestheticKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-2 bg-[#DCB297]/10 text-[#DCB297] px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {kw}
                      <button
                        onClick={() => setBrandData((p) => ({ ...p, aestheticKeywords: p.aestheticKeywords.filter((k) => k !== kw) }))}
                        className="hover:bg-[#DCB297]/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color Palette</label>
                <div className="flex gap-3 flex-wrap">
                  {brandData.colorPalette.map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <button
                        className="w-16 h-16 rounded-lg border-2 border-gray-200 hover:border-[#DCB297] transition-colors shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-gray-600 font-mono">{color}</span>
                    </div>
                  ))}
                  <button className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#DCB297] flex items-center justify-center text-gray-400 hover:text-[#DCB297] transition-colors text-2xl">
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Images */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Reference Images</h2>
            <p className="text-sm text-gray-600 mb-4">Upload images that represent your brand's visual style</p>
            <div className="grid grid-cols-4 gap-4">
              {brandData.referenceImages.map((image, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <button className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#DCB297] hover:bg-gray-50 flex flex-col items-center justify-center gap-2 transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-600">Upload</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
              Save Brand DNA
            </button>
          </div>
        </div>
      </div>

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl">
            <h2 className="text-2xl font-semibold mb-2">Scan Website for Brand DNA</h2>
            <p className="text-gray-600 mb-6">
              Our AI will analyze your website to extract brand guidelines, colors, and style preferences.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Website URL</label>
              <input
                type="url"
                value={brandData.website}
                onChange={(e) => setBrandData((p) => ({ ...p, website: e.target.value }))}
                placeholder="https://yourbrand.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                autoFocus
              />
            </div>
            {isScanning && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Scanning website...</span>
                  <span className="text-sm font-medium">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5B290] to-[#DCB297] transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowScanModal(false); setIsScanning(false); }}
                disabled={isScanning}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScan}
                disabled={!brandData.website || isScanning}
                className="px-6 py-2.5 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? "Scanning..." : "Start Scan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
