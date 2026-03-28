import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Pipette } from "lucide-react";

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export function ColorPicker({
  isOpen,
  onClose,
  onColorSelect,
  currentColor,
  setCurrentColor,
  triggerRef,
}: ColorPickerProps) {
  const [hue, setHue] = useState(220);
  const [activeTab, setActiveTab] = useState<"solid" | "gradient">("solid");
  const pickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddColor = () => {
    onColorSelect(currentColor);
    onClose();
  };

  const content = (
    <div
      ref={pickerRef}
      className="fixed z-[9999] bg-white rounded-xl shadow-lg border border-gray-200 p-4"
      style={{ top: `${position.top}px`, left: `${position.left}px`, width: "340px", maxWidth: "calc(100vw - 32px)" }}
    >
      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("solid")}
          className={`pb-3 px-1 font-medium text-sm relative ${activeTab === "solid" ? "text-black" : "text-gray-400"}`}
        >
          Solid color
          {activeTab === "solid" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
        <button
          onClick={() => setActiveTab("gradient")}
          className={`pb-3 px-1 font-medium text-sm relative ${activeTab === "gradient" ? "text-black" : "text-gray-400"}`}
        >
          Gradient
          {activeTab === "gradient" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
        </button>
      </div>

      {activeTab === "solid" && (
        <div className="space-y-4">
          {/* Color Gradient */}
          <div
            className="w-full h-[180px] rounded-lg relative cursor-crosshair"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,1) 100%),
                          linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`,
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const s = Math.round((x / rect.width) * 100);
              const l = Math.round(100 - (y / rect.height) * 100);
              setCurrentColor(`hsl(${Math.round(hue)}, ${s}%, ${l}%)`);
            }}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{ left: "30%", top: "40%", transform: "translate(-50%, -50%)" }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative h-3">
            <div
              className="w-full h-3 rounded-full cursor-pointer"
              style={{
                background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newHue = (x / rect.width) * 360;
                setHue(newHue);
              }}
            >
              <div
                className="absolute top-1/2 w-5 h-5 bg-white border-2 border-gray-300 rounded-full shadow-md pointer-events-none"
                style={{ left: `${(hue / 360) * 100}%`, transform: "translate(-50%, -50%)" }}
              />
            </div>
          </div>

          {/* Color Input */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2">
              <div className="w-8 h-8 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: currentColor }} />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="flex-1 outline-none text-sm font-medium"
                placeholder="#2B2C30"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Pipette className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleAddColor}
            className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:opacity-90 text-sm"
          >
            Add Color
          </button>
        </div>
      )}

      {activeTab === "gradient" && (
        <div className="text-center text-gray-500 py-8 text-sm">Gradient picker coming soon</div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
