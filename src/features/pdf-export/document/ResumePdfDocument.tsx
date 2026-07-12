import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Resume } from '@/types/resume'
import { formatMonthYear } from '@/lib/date'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 12,
    borderBottom: '1pt solid #000',
    paddingBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 9,
    color: '#333',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    borderBottom: '0.5pt solid #666',
    paddingBottom: 2,
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  position: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  company: {
    fontSize: 9,
    color: '#333',
  },
  dateLocation: {
    fontSize: 9,
    color: '#666',
    textAlign: 'right',
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    marginTop: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  bullet: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  skills: {
    fontSize: 9,
    lineHeight: 1.5,
  },
})

interface ResumePdfDocumentProps {
  resume: Resume
}

export function ResumePdfDocument({ resume }: ResumePdfDocumentProps) {
  const { personalInfo, summary, experience, education, skills, certifications } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
            {personalInfo.city && <Text>{personalInfo.city}</Text>}
            {personalInfo.linkedin && <Text>{personalInfo.linkedin}</Text>}
            {personalInfo.portfolio && <Text>{personalInfo.portfolio}</Text>}
          </View>
        </View>

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.description}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.position}>{exp.position || 'Position'}</Text>
                    <Text style={styles.company}>{exp.company || 'Company'}</Text>
                  </View>
                  <View style={styles.dateLocation}>
                    {exp.location && <Text>{exp.location}</Text>}
                    <Text>
                      {formatMonthYear(exp.startDate)} -{' '}
                      {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate || '')}
                    </Text>
                  </View>
                </View>
                {exp.description && (
                  <View style={styles.description}>
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <View key={i} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{line}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.position}>{edu.degree || 'Degree'}</Text>
                    <Text style={styles.company}>{edu.institution || 'Institution'}</Text>
                    {edu.fieldOfStudy && <Text style={styles.company}>{edu.fieldOfStudy}</Text>}
                  </View>
                  <View style={styles.dateLocation}>
                    {edu.location && <Text>{edu.location}</Text>}
                    <Text>
                      {formatMonthYear(edu.startDate)} -{' '}
                      {edu.isCurrent ? 'Present' : formatMonthYear(edu.endDate || '')}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{skills.join(' • ')}</Text>
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.description}>
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{cert.name || 'Certification'}</Text>
                  {cert.issuer && <Text> - {cert.issuer}</Text>}
                  {cert.date && <Text> ({formatMonthYear(cert.date)})</Text>}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
