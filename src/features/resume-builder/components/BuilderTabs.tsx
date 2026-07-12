import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUiStore, type BuilderTab } from '@/store/uiStore'

const tabs: { value: BuilderTab; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'summary', label: 'Summary' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'skills', label: 'Skills' },
  { value: 'certifications', label: 'Certifications' },
]

export function BuilderTabs() {
  const activeTab = useUiStore((s) => s.activeTab)
  const setActiveTab = useUiStore((s) => s.setActiveTab)

  return (
    <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as BuilderTab)}>
      <TabsList className="grid w-full grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
