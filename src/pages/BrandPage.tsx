import { useState, useRef } from "react";
import { Sparkles, Globe, Upload, X, FileText, Image, CheckCircle, ImagePlus } from "lucide-react";

interface BrandData {
  name: string;
  website: string;
  description: string;
  targetAudience: string;
  aestheticKeywords: string[];
  colorPalette: string[];
  referenceImages: string[];
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
}

export function BrandPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanModal, setShowScanModal] = useState(false);
  const [tempKeyword, setTempKeyword] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showSections, setShowSections] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const processFiles = (files: File[]) => {
    if (files.length === 0) return;

    const newFiles = files.map((f) => ({ name: f.name, type: f.type, size: f.size }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    const imageUrls = files
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => URL.createObjectURL(f));
    if (imageUrls.length > 0) setReferenceImageUrls((prev) => [...prev, ...imageUrls]);
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 8;
      });
    }, 150);

    setTimeout(() => {
      setIsProcessing(false);
      setShowSections(true);
      setBrandData((prev) => ({
        ...prev,
        name: "Maison Éclat",
        website: "https://maisoneclat.com",
        description: "A contemporary luxury fashion brand rooted in Parisian elegance and modern minimalism. We create timeless pieces that balance refined craftsmanship with sustainable practices.",
        targetAudience: "Style-conscious women aged 28–45 who value quality, sustainability, and understated luxury",
        aestheticKeywords: ["Minimalist", "Luxe", "Parisian", "Timeless", "Sustainable"],
        colorPalette: ["#E5B290", "#DCB297", "#2C2D30", "#F8F8F8", "#787878"],
      }));
    }, 2200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setShowSections(false);
      return updated;
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4 text-gray-400" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const handleReset = () => {
    setBrandData((prev) => ({
      ...prev,
      name: "",
      website: "",
      description: "",
      targetAudience: "",
      aestheticKeywords: [],
      colorPalette: ["#E5B290", "#DCB297", "#2C2D30", "#F8F8F8", "#787878"],
    }));
    setReferenceImageUrls([]);
    setUploadedFiles([]);
    setTempKeyword("");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brand DNA</h1>
          <p className="text-sm text-gray-600 mt-1">Define your brand identity to power AI-generated content</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8 space-y-8">

          {/* Upload Files */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Upload Files</h2>

            {/* Processing indicator */}
            {isProcessing && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">Extracting brand information…</span>
                  <span className="text-sm font-medium">{processingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5B290] to-[#DCB297] transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer min-h-[33vh] ${
                isDragOver
                  ? "border-[#DCB297] bg-[#DCB297]/5"
                  : "border-gray-300 hover:border-[#DCB297] hover:bg-gray-50"
              }`}
            >
              <Upload className={`w-8 h-8 ${isDragOver ? "text-[#DCB297]" : "text-gray-400"}`} />
              <p className="text-sm text-gray-600">Drag and drop your brand guidelines or reference images.</p>
              <span
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="px-5 py-2 bg-black hover:bg-gray-900 text-white text-sm font-medium rounded-full transition-colors"
              >
                Upload files
              </span>
            </div>

            {/* Uploaded file list */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                    {getFileIcon(file.type)}
                    <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400">{formatSize(file.size)}</span>
                    {!isProcessing && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-gray-600 ml-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Info — shown after upload */}
          {showSections && (
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
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={brandData.website}
                      onChange={(e) => setBrandData((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://yourbrand.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DCB297] focus:border-transparent"
                    />
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
          )}

          {/* Aesthetic & Style — shown after upload */}
          {showSections && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Aesthetic & Style</h2>
              <div className="space-y-4">
                {referenceImageUrls.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Reference Images</label>
                    <input
                      ref={imageInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const urls = files.map((f) => URL.createObjectURL(f));
                        setReferenceImageUrls((prev) => [...prev, ...urls]);
                        e.target.value = "";
                      }}
                    />
                    <div className="grid grid-cols-4 gap-3">
                      {referenceImageUrls.map((url, i) => (
                        <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setReferenceImageUrls((prev) => prev.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-[#DCB297] hover:bg-gray-50 flex flex-col items-center justify-center gap-3 transition-colors"
                      >
                        <ImagePlus className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-500">Add image</span>
                      </button>
                    </div>
                  </div>
                )}

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
                        className="inline-flex items-center gap-2 bg-[#DCB297]/20 text-[#7A4F2D] px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        {kw}
                        <button
                          onClick={() => setBrandData((p) => ({ ...p, aestheticKeywords: p.aestheticKeywords.filter((k) => k !== kw) }))}
                          className="hover:bg-[#7A4F2D]/20 rounded-full p-0.5 text-[#7A4F2D]"
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
          )}

        </div>
      </div>

      {/* Sticky Save Button */}
      {showSections && (
        <div className="bg-white border-t border-gray-200 py-4 flex items-center justify-center gap-4">
          <button onClick={handleReset} className="px-10 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium">
            Reset
          </button>
          <button className="px-10 py-3 bg-gradient-to-r from-[#E5B290] to-[#DCB297] text-white rounded-full hover:opacity-90 transition-opacity font-medium">
            Save Brand DNA
          </button>
        </div>
      )}

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
