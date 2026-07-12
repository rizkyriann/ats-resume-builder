import { useResumeStore } from '@/store/resumeStore'
import { formatMonthYear } from '@/lib/date'
import { DownloadPdfButton } from '@/features/pdf-export/components/DownloadPdfButton'

export function PreviewPane() {
  const resume = useResumeStore((s) => s.resume)
  const { personalInfo, summary, experience, education, skills, certifications } = resume

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-4 flex justify-end">
        <DownloadPdfButton />
      </div>
      <div className="border-[3px] border-black bg-white p-8">
        {/* Header */}
        <div className="border-b-[3px] border-black pb-4">
          <h1 className="rb-headline text-3xl uppercase tracking-wide">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.jobTitle && (
            <p className="mt-1 text-lg">{personalInfo.jobTitle}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.city && <span>{personalInfo.city}</span>}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.portfolio && (
              <a href={personalInfo.portfolio} className="text-blue-600 hover:underline">
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mt-6">
            <h2 className="rb-headline text-lg uppercase tracking-wide">Summary</h2>
            <p className="mt-2 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mt-6">
            <h2 className="rb-headline text-lg uppercase tracking-wide">Experience</h2>
            <div className="mt-3 space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{exp.position || 'Position'}</h3>
                      <p className="text-sm">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {exp.location && <p>{exp.location}</p>}
                      <p>
                        {formatMonthYear(exp.startDate)} -{' '}
                        {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate || '')}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <ul className="mt-2 list-inside list-disc text-sm">
                      {exp.description.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mt-6">
            <h2 className="rb-headline text-lg uppercase tracking-wide">Education</h2>
            <div className="mt-3 space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{edu.degree || 'Degree'}</h3>
                      <p className="text-sm">{edu.institution || 'Institution'}</p>
                      {edu.fieldOfStudy && <p className="text-sm">{edu.fieldOfStudy}</p>}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {edu.location && <p>{edu.location}</p>}
                      <p>
                        {formatMonthYear(edu.startDate)} -{' '}
                        {edu.isCurrent ? 'Present' : formatMonthYear(edu.endDate || '')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h2 className="rb-headline text-lg uppercase tracking-wide">Skills</h2>
            <p className="mt-2 text-sm">{skills.join(' • ')}</p>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="rb-headline text-lg uppercase tracking-wide">
              Certifications
            </h2>
            <div className="mt-3 space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-sm">
                  <span className="font-semibold">{cert.name || 'Certification'}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.date && <span> ({formatMonthYear(cert.date)})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
