import { PersonalInfoForm } from './PersonalInfoForm'
import { SummaryForm } from './SummaryForm'
import { ExperienceList } from './ExperienceList'
import { EducationList } from './EducationList'
import { SkillsInput } from './SkillsInput'
import { CertificationsList } from './CertificationsList'
import { useUiStore } from '@/store/uiStore'

export function BuilderPane() {
  const activeTab = useUiStore((s) => s.activeTab)

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      {activeTab === 'personal' && <PersonalInfoForm />}
      {activeTab === 'summary' && <SummaryForm />}
      {activeTab === 'experience' && <ExperienceList />}
      {activeTab === 'education' && <EducationList />}
      {activeTab === 'skills' && <SkillsInput />}
      {activeTab === 'certifications' && <CertificationsList />}
    </div>
  )
}
