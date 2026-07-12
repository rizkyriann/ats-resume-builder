import { pdf } from '@react-pdf/renderer'
import { ResumePdfDocument } from '@/features/pdf-export/document/ResumePdfDocument'
import { slugifyResumeName } from '@/lib/slug'
import type { Resume } from '@/types/resume'

export async function downloadResumePdf(resume: Resume): Promise<void> {
  const blob = await pdf(<ResumePdfDocument resume={resume} />).toBlob()

  const filename = slugifyResumeName(resume.personalInfo.fullName) + '.pdf'

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
