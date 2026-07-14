import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { downloadResumePdf } from '@/services/pdf/generatePdfBlob'
import { toast } from 'sonner'

export function DownloadPdfButton() {
  const resume = useResumeStore((s) => s.resume)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!resume.personalInfo.fullName.trim()) {
      toast.error('Please add your name before downloading')
      return
    }

    setIsGenerating(true)
    try {
      await downloadResumePdf(resume)
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isGenerating} size="sm">
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? 'Generating...' : 'Download PDF'}
    </Button>
  )
}
