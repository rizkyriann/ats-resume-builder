import { useUiStore } from "@/store/uiStore";
import { DownloadPdfButton } from "@/features/pdf-export/components/DownloadPdfButton";

type NavSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications";

interface NavItem {
  id: NavSection;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "personal", label: "Personal Info", icon: "👤" },
  { id: "summary", label: "Summary", icon: "📄" },
  { id: "experience", label: "Experience", icon: "💼" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "skills", label: "Skills", icon: "✨" },
  { id: "certifications", label: "Certifications", icon: "✓" },
];

export function SideNav() {
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  return (
    <nav className="flex h-[calc(100vh-80px)] w-64 shrink-0 flex-col border-r border-qu-border bg-qu-surface sticky">
      <div className="p-6">
        <h2 className="qu-headline text-xl uppercase tracking-wide text-qu-gold">
          Scribe's Workshop
        </h2>
        <p className="mt-1 text-xs text-qu-text-muted">Drafting your legend</p>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                flex items-center gap-3 rounded-qu px-4 py-2.5 text-left transition-all
                ${
                  isActive
                    ? "bg-qu-gold text-qu-bg font-medium"
                    : "text-qu-text-muted hover:bg-qu-surface-raised hover:text-qu-text"
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="qu-headline text-[11px] uppercase tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-qu-border p-5 flex justify-center">
        <DownloadPdfButton />
      </div>
    </nav>
  );
}
