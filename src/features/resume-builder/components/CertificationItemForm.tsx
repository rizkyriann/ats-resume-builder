import { useResumeStore } from '@/store/resumeStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { Certification } from '@/types/resume'

interface CertificationItemFormProps {
  id: string
  index: number
}

export function CertificationItemForm({ id, index }: CertificationItemFormProps) {
  const certifications = useResumeStore((s) => s.resume.certifications)
  const updateCertification = useResumeStore((s) => s.updateCertification)
  const removeCertification = useResumeStore((s) => s.removeCertification)
  const reorderCertifications = useResumeStore((s) => s.reorderCertifications)

  const cert = certifications.find((c) => c.id === id)
  if (!cert) return null

  const handleChange = (field: keyof Omit<Certification, 'id'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateCertification(id, { [field]: e.target.value })
  }

  const canMoveUp = index > 0
  const canMoveDown = index < certifications.length - 1

  return (
    <div className="border-[3px] border-black bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold uppercase tracking-wide">Certification #{index + 1}</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderCertifications(index, index - 1)}
            disabled={!canMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => reorderCertifications(index, index + 1)}
            disabled={!canMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => removeCertification(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`${id}-name`}>Certification Name *</Label>
          <Input
            id={`${id}-name`}
            value={cert.name}
            onChange={handleChange('name')}
            placeholder="AWS Certified Solutions Architect"
          />
        </div>

        <div>
          <Label htmlFor={`${id}-issuer`}>Issuing Organization</Label>
          <Input
            id={`${id}-issuer`}
            value={cert.issuer}
            onChange={handleChange('issuer')}
            placeholder="Amazon Web Services"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-date`}>Issue Date</Label>
            <Input
              id={`${id}-date`}
              type="month"
              value={cert.date}
              onChange={handleChange('date')}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-credentialUrl`}>Credential URL</Label>
            <Input
              id={`${id}-credentialUrl`}
              value={cert.credentialUrl}
              onChange={handleChange('credentialUrl')}
              placeholder="https://www.credly.com/badges/..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
