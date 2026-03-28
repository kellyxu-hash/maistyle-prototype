import { Outlet, useLocation, useNavigate } from "react-router";
import { Folder, Grid3x3, Package } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/" || location.pathname.startsWith("/project");
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[92px] bg-[#f1f1f1] border-r border-gray-200 flex flex-col items-center flex-shrink-0">
        {/* Logo */}
        <div className="h-[70px] w-full flex items-center justify-center border-b border-white/10">
          <svg width="51" height="29" viewBox="0 0 51 29" fill="none">
            <path
              d="M25.3 0L0 28.8h10.2L25.3 11.5 40.4 28.8h10.2L25.3 0z"
              fill="#E5B290"
            />
          </svg>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full flex flex-col gap-3 px-2 pt-[50px]">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
              isActive("/") ? "bg-white border border-gray-200" : "hover:bg-gray-50"
            }`}
          >
            <Folder className={`w-5 h-5 ${isActive("/") ? "text-[#DCB297]" : "text-gray-600"}`} />
            <span className={`text-[13px] tracking-[-0.15px] ${isActive("/") ? "font-semibold text-[#DCB297]" : "text-gray-600"}`}>
              Projects
            </span>
          </button>

          <button
            onClick={() => navigate("/brand")}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
              isActive("/brand") ? "bg-white border border-gray-200" : "hover:bg-gray-50"
            }`}
          >
            <Package className={`w-5 h-5 ${isActive("/brand") ? "text-[#DCB297]" : "text-gray-600"}`} />
            <span className={`text-[13px] tracking-[-0.15px] ${isActive("/brand") ? "font-semibold text-[#DCB297]" : "text-gray-600"}`}>
              Brand
            </span>
          </button>

          <button
            onClick={() => navigate("/exports")}
            className={`flex flex-col items-center justify-center gap-2 py-3 rounded-lg transition-colors ${
              isActive("/exports") ? "bg-white border border-gray-200" : "hover:bg-gray-50"
            }`}
          >
            <Grid3x3 className={`w-5 h-5 ${isActive("/exports") ? "text-[#DCB297]" : "text-gray-600"}`} />
            <span className={`text-[13px] tracking-[-0.15px] ${isActive("/exports") ? "font-semibold text-[#DCB297]" : "text-gray-600"}`}>
              Exports
            </span>
          </button>
        </nav>

        {/* Settings */}
        <div className="pb-10">
          <button className="p-3 hover:bg-gray-50 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 12.5C11.38 12.5 12.5 11.38 12.5 10C12.5 8.62 11.38 7.5 10 7.5C8.62 7.5 7.5 8.62 7.5 10C7.5 11.38 8.62 12.5 10 12.5Z"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.17 12.5C16.06 12.75 16.02 13.03 16.07 13.3C16.12 13.57 16.25 13.82 16.44 14.02L16.49 14.07C16.64 14.22 16.77 14.4 16.85 14.6C16.93 14.8 16.97 15.02 16.97 15.23C16.97 15.45 16.93 15.66 16.85 15.86C16.77 16.06 16.64 16.24 16.49 16.4C16.34 16.55 16.16 16.67 15.96 16.75C15.76 16.84 15.54 16.88 15.33 16.88C15.11 16.88 14.9 16.84 14.7 16.75C14.5 16.67 14.31 16.55 14.16 16.4L14.11 16.35C13.92 16.15 13.67 16.03 13.4 15.98C13.13 15.93 12.85 15.96 12.6 16.07C12.35 16.18 12.14 16.35 11.99 16.58C11.84 16.8 11.77 17.06 11.77 17.33V17.5C11.77 17.94 11.59 18.37 11.28 18.68C10.97 18.99 10.54 19.17 10.1 19.17C9.66 19.17 9.23 18.99 8.92 18.68C8.61 18.37 8.43 17.94 8.43 17.5V17.43C8.43 17.15 8.34 16.88 8.19 16.65C8.03 16.42 7.81 16.25 7.56 16.14C7.31 16.03 7.03 16 6.76 16.05C6.49 16.1 6.24 16.23 6.04 16.42L5.99 16.47C5.84 16.62 5.66 16.74 5.46 16.82C5.26 16.9 5.04 16.95 4.83 16.95C4.61 16.95 4.4 16.9 4.2 16.82C4 16.74 3.81 16.62 3.66 16.47C3.51 16.32 3.39 16.13 3.31 15.93C3.22 15.73 3.18 15.52 3.18 15.3C3.18 15.09 3.22 14.87 3.31 14.67C3.39 14.47 3.51 14.29 3.66 14.14L3.71 14.09C3.9 13.89 4.03 13.64 4.08 13.37C4.13 13.1 4.1 12.82 3.99 12.57C3.88 12.33 3.7 12.12 3.48 11.97C3.26 11.82 3 11.74 2.73 11.74H2.5C2.06 11.74 1.63 11.57 1.32 11.26C1.01 10.94 0.83 10.52 0.83 10.08C0.83 9.63 1.01 9.21 1.32 8.9C1.63 8.59 2.06 8.41 2.5 8.41H2.58C2.85 8.4 3.12 8.32 3.35 8.16C3.58 8.01 3.75 7.79 3.86 7.54C3.97 7.28 4 7 3.95 6.73C3.9 6.46 3.77 6.21 3.58 6.02L3.53 5.97C3.38 5.82 3.26 5.63 3.18 5.43C3.09 5.23 3.05 5.02 3.05 4.8C3.05 4.59 3.09 4.37 3.18 4.17C3.26 3.97 3.38 3.79 3.53 3.64C3.68 3.49 3.87 3.36 4.07 3.28C4.27 3.2 4.48 3.16 4.7 3.16C4.91 3.16 5.13 3.2 5.33 3.28C5.53 3.36 5.71 3.49 5.86 3.64L5.91 3.69C6.11 3.88 6.36 4.01 6.63 4.06C6.9 4.11 7.18 4.07 7.43 3.96H7.5C7.75 3.86 7.96 3.68 8.1 3.46C8.25 3.23 8.33 2.97 8.33 2.7V2.5C8.33 2.06 8.5 1.63 8.82 1.32C9.13 1.01 9.55 0.83 10 0.83C10.44 0.83 10.86 1.01 11.17 1.32C11.49 1.63 11.66 2.06 11.66 2.5V2.58C11.66 2.84 11.74 3.11 11.89 3.33C12.03 3.55 12.24 3.73 12.49 3.84C12.74 3.95 13.02 3.98 13.29 3.93C13.56 3.88 13.81 3.75 14.01 3.56L14.06 3.51C14.21 3.36 14.39 3.24 14.59 3.16C14.79 3.07 15.01 3.03 15.22 3.03C15.44 3.03 15.65 3.07 15.85 3.16C16.05 3.24 16.23 3.36 16.39 3.51C16.54 3.66 16.66 3.85 16.74 4.05C16.83 4.25 16.87 4.46 16.87 4.68C16.87 4.89 16.83 5.11 16.74 5.31C16.66 5.51 16.54 5.69 16.39 5.84L16.34 5.89C16.14 6.09 16.02 6.34 15.97 6.61C15.92 6.88 15.95 7.16 16.06 7.41V7.5C16.17 7.75 16.34 7.96 16.57 8.1C16.79 8.25 17.05 8.33 17.32 8.33H17.5C17.94 8.33 18.37 8.5 18.68 8.82C18.99 9.13 19.17 9.55 19.17 10C19.17 10.44 18.99 10.86 18.68 11.17C18.37 11.49 17.94 11.66 17.5 11.66H17.43C17.16 11.66 16.89 11.74 16.67 11.89C16.45 12.03 16.27 12.24 16.17 12.5Z"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
