import { useResumeStore } from "@/store/resumeStore";
import { formatMonthYear } from "@/lib/date";

export function SimpleResumePreview() {
  const resume = useResumeStore((s) => s.resume);
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    certifications,
  } = resume;

  return (
    <div
      className="aspect-[1/1.41] w-full bg-white p-4 text-[10px] leading-tight text-black shadow-lg"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-3 border-b border-black pb-2">
        <p className="mb-0.5 text-[18px] font-bold leading-tight">
          {personalInfo.fullName || "Your Name"}
        </p>
        {personalInfo.jobTitle && (
          <p className="mb-1 text-[12px] text-[#333]">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-[9px] text-[#333]">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.city && <span>{personalInfo.city}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-3">
          <p className="mb-1.5 border-b border-[#666] pb-0.5 text-[11px] font-bold uppercase tracking-[0.5px]">
            Summary
          </p>
          <p className="mt-0.5 text-[9px] leading-[1.4]">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 border-b border-[#666] pb-0.5 text-[11px] font-bold uppercase tracking-[0.5px]">
            Experience
          </p>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="mb-0.5 flex justify-between">
                <div>
                  <p className="text-[10px] font-bold">
                    {exp.position || "Position"}
                  </p>
                  <p className="text-[9px] text-[#333]">
                    {exp.company || "Company"}
                  </p>
                </div>
                <div className="text-right text-[9px] text-[#666]">
                  {exp.location && <p>{exp.location}</p>}
                  <p>
                    {formatMonthYear(exp.startDate)} -{" "}
                    {exp.isCurrent
                      ? "Present"
                      : formatMonthYear(exp.endDate || "")}
                  </p>
                </div>
              </div>
              {exp.description && (
                <div className="mt-0.5 text-[9px] leading-[1.4]">
                  {exp.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-[10px]">•</span>
                        <span className="flex-1">{line}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 border-b border-[#666] pb-0.5 text-[11px] font-bold uppercase tracking-[0.5px]">
            Education
          </p>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="mb-0.5 flex justify-between">
                <div>
                  <p className="text-[10px] font-bold">
                    {edu.degree || "Degree"}
                  </p>
                  <p className="text-[9px] text-[#333]">
                    {edu.institution || "Institution"}
                  </p>
                  {edu.fieldOfStudy && (
                    <p className="text-[9px] text-[#333]">{edu.fieldOfStudy}</p>
                  )}
                </div>
                <div className="text-right text-[9px] text-[#666]">
                  {edu.location && <p>{edu.location}</p>}
                  <p>
                    {formatMonthYear(edu.startDate)} -{" "}
                    {edu.isCurrent
                      ? "Present"
                      : formatMonthYear(edu.endDate || "")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 border-b border-[#666] pb-0.5 text-[11px] font-bold uppercase tracking-[0.5px]">
            Skills
          </p>
          <p className="text-[9px] leading-[1.5]">{skills.join(" • ")}</p>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 border-b border-[#666] pb-0.5 text-[11px] font-bold uppercase tracking-[0.5px]">
            Certifications
          </p>
          {certifications.map((cert) => (
            <div key={cert.id} className="text-[9px] leading-[1.4]">
              <p>
                <span className="font-bold">
                  {cert.name || "Certification"}
                </span>
                {cert.issuer && <span> - {cert.issuer}</span>}
                {cert.date && <span> ({formatMonthYear(cert.date)})</span>}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
