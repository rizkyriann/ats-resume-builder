import { useUiStore } from "@/store/uiStore";
import { BuilderPane } from "@/features/resume-builder/components/BuilderPane";
import { PreviewPane } from "@/features/resume-preview/components/PreviewPane";
import {
  ExportJsonButton,
  ImportJsonButton,
} from "@/features/import-export/components/ImportExportButtons";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const isSaving = useUiStore((s) => s.isSaving);

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="border-b-[3px] border-black bg-white">
          <div className="container flex h-20 items-center justify-between px-6">
            <h1 className="rb-headline text-2xl uppercase tracking-wide">
              ATS Resume Builder
            </h1>
            <div className="flex items-center gap-3">
              <ImportJsonButton />
              <ExportJsonButton />
              {isSaving && (
                <span className="font-mono text-xs uppercase tracking-wider">
                  Saving...
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <div className="w-full overflow-y-auto border-r-[3px] border-black lg:w-1/2">
            <BuilderPane />
          </div>
          <div className="hidden w-1/2 overflow-y-auto bg-[#f0f0f0] lg:block">
            <PreviewPane />
          </div>
        </main>
      </div>
      <Toaster />
    </>
  );
}
