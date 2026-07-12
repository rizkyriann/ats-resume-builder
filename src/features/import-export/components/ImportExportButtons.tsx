import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'

export function ExportJsonButton() {
  const resume = useResumeStore((s) => s.resume)

  const handleExport = () => {
    try {
      const json = JSON.stringify(resume, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const filename = resume.personalInfo.fullName
        ? `${resume.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.json`
        : 'resume.json'

      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Resume exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Failed to export resume')
    }
  }

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      Export JSON
    </Button>
  )
}

export function ImportJsonButton() {
  const [isImporting, setIsImporting] = useState(false)
  const setResume = useResumeStore((s) => s.setResume)

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const json = evt.target?.result as string
        const data = JSON.parse(json)

        // Basic validation - should use ResumeSchema.safeParse in production
        if (!data.personalInfo) {
          throw new Error('Invalid resume format')
        }

        if (confirm('This will replace your current resume. Continue?')) {
          setResume(data)
          toast.success('Resume imported successfully')
        }
      } catch (error) {
        console.error('Import failed:', error)
        toast.error('Failed to import resume. Invalid file format.')
      } finally {
        setIsImporting(false)
        e.target.value = ''
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
      setIsImporting(false)
    }

    reader.readAsText(file)
  }

  return (
    <>
      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        disabled={isImporting}
        className="hidden"
        id="import-json"
      />
      <label htmlFor="import-json">
        <Button variant="outline" size="sm" asChild disabled={isImporting}>
          <span>
            <Upload className="mr-2 h-4 w-4" />
            {isImporting ? 'Importing...' : 'Import JSON'}
          </span>
        </Button>
      </label>
    </>
  )
}
