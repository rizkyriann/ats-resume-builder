import { useResumeStore } from '@/store/resumeStore'
import { CertificationItemForm } from './CertificationItemForm'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export function CertificationsList() {
  const certifications = useResumeStore((s) => s.resume.certifications)
  const addCertification = useResumeStore((s) => s.addCertification)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="qu-headline text-2xl uppercase tracking-wide">
          Certifications
        </h2>
        <p className="mt-1 text-sm">
          Add professional certifications, licenses, or credentials.
        </p>
      </div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <CertificationItemForm key={cert.id} id={cert.id} index={index} />
        ))}
      </div>

      <Button onClick={addCertification} variant="outline" className="w-full">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Certification
      </Button>
    </div>
  )
}
