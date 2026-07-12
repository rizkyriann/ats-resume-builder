import { BuilderTabs } from './BuilderTabs'
import { PersonalInfoForm } from './PersonalInfoForm'
import { SummaryForm } from './SummaryForm'
import { ExperienceList } from './ExperienceList'
import { EducationList } from './EducationList'
import { SkillsInput } from './SkillsInput'
import { CertificationsList } from './CertificationsList'
import { AtsScorePanel } from '@/features/ats-score/components/AtsScorePanel'
import { KeywordMatchPanel } from '@/features/keyword-match/components/KeywordMatchPanel'
import { useUiStore } from '@/store/uiStore'

export function BuilderPane() {
  const activeTab = useUiStore((s) => s.activeTab)

  return (
    <div className="container max-w-4xl space-y-8 py-8">
      <AtsScorePanel />
      <KeywordMatchPanel />

      <BuilderTabs />
      <div className="mt-6">
        {activeTab === 'personal' && <PersonalInfoForm />}
        {activeTab === 'summary' && <SummaryForm />}
        {activeTab === 'experience' && <ExperienceList />}
        {activeTab === 'education' && <EducationList />}
        {activeTab === 'skills' && <SkillsInput />}
        {activeTab === 'certifications' && <CertificationsList />}
      </div>
    </div>
  )
}
