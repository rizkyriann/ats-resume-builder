import { SideNav } from "@/features/resume-builder/components/SideNav";
import { BuilderPane } from "@/features/resume-builder/components/BuilderPane";
import { RightSidebar } from "@/features/resume-preview/components/RightSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-qu-bg">
        <header className="border-b border-qu-gold/40 bg-qu-surface shadow-qu-sm">
          <div className="container flex h-20 items-center justify-between px-6">
            <h1 className="qu-headline text-2xl uppercase tracking-wide text-qu-gold">
              ATS Resume Builder
            </h1>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <SideNav />
          <div className="flex-1 overflow-y-auto bg-qu-bg">
            <BuilderPane />
          </div>
          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
