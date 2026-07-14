import { SimpleResumePreview } from "@/features/resume-preview/components/SimpleResumePreview";

export function RightSidebar() {
  return (
    <aside className="flex w-[500px] flex-col gap-6 border-l border-qu-border bg-qu-surface-raised p-6">
      {/* Top Section: ATS Score & Keyword Match - Side by Side */}

      {/* Middle Section: Resume Preview */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto rounded-xl bg-qu-bg/50 p-4">
        <div className="w-full origin-top scale-95">
          <SimpleResumePreview />
        </div>
      </div>

      {/* Bottom Section: Insight Status Card */}
    </aside>
  );
}

function AtsScoreCircle() {
  const score = 72;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="h-full w-full -rotate-90 transform">
        <circle
          className="text-qu-border"
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
        />
        <circle
          className="text-qu-gold transition-all duration-1000"
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="qu-headline absolute text-xl text-qu-gold">
        {score}%
      </span>
    </div>
  );
}

