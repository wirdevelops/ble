'use client';

import { motion } from 'framer-motion';
import {
  BiBookOpen,
  BiTrophy,
  BiGroup,
  BiTime,
  BiCalendar,
  BiCertification,
  BiUser,
} from 'react-icons/bi';

// Types
interface Course {
  id: number;
  title: string;
  progress: number;
  duration: string;
  enrolled: number;
  status: 'In Progress' | 'Completed';
}

interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  expires: string | null;
  verified: boolean;
}

interface MentorshipProgram {
  id: number;
  name: string;
  mentor: string;
  role: string;
  duration: string;
  status: 'Active' | 'Completed';
}

// Mock Data
const courses: Course[] = [
  {
    id: 1,
    title: 'Business Leadership Essentials',
    progress: 75,
    duration: '8 weeks',
    enrolled: 1200,
    status: 'In Progress',
  },
  {
    id: 2,
    title: 'Digital Marketing Fundamentals',
    progress: 100,
    duration: '6 weeks',
    enrolled: 850,
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Project Management Professional',
    progress: 30,
    duration: '12 weeks',
    enrolled: 650,
    status: 'In Progress',
  },
];

const certifications: Certification[] = [
  {
    id: 1,
    name: 'Professional Business Management',
    issuer: 'Business Institute',
    date: 'Feb 2024',
    expires: 'Feb 2026',
    verified: true,
  },
  {
    id: 2,
    name: 'Digital Marketing Specialist',
    issuer: 'Marketing Academy',
    date: 'Jan 2024',
    expires: 'Jan 2025',
    verified: true,
  },
  {
    id: 3,
    name: 'Project Management Professional',
    issuer: 'PM Institute',
    date: 'In Progress',
    expires: null,
    verified: false,
  },
];

const mentorshipPrograms: MentorshipProgram[] = [
  {
    id: 1,
    name: 'Leadership Mentorship',
    mentor: 'Sarah Johnson',
    role: 'CEO, Tech Solutions',
    duration: '6 months',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Business Development',
    mentor: 'Michael Chen',
    role: 'Business Strategist',
    duration: '3 months',
    status: 'Completed',
  },
];

// Components
const CourseCard = ({ course }: { course: Course }) => (
  <motion.div
    key={course.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <BiBookOpen className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-medium text-text">{course.title}</h3>
        <p className="text-sm text-text/60">{course.status}</p>
      </div>
    </div>
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text/60">Progress</span>
        <span className="text-sm font-medium text-text">{course.progress}%</span>
      </div>
      <div className="w-full h-2 bg-surface border border-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${course.progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
    <div className="flex items-center justify-between text-sm text-text/60">
      <div className="flex items-center gap-2">
        <BiTime className="w-4 h-4" />
        <span>{course.duration}</span>
      </div>
      <div className="flex items-center gap-2">
        <BiGroup className="w-4 h-4" />
        <span>{course.enrolled} enrolled</span>
      </div>
    </div>
  </motion.div>
);

const CertificationCard = ({ cert }: { cert: Certification }) => (
  <motion.div
    key={cert.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <BiCertification className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-medium text-text">{cert.name}</h3>
        <p className="text-sm text-text/60">{cert.issuer}</p>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-text/60">Issued</span>
        <span className="text-text">{cert.date}</span>
      </div>
      {cert.expires && (
        <div className="flex items-center justify-between">
          <span className="text-text/60">Expires</span>
          <span className="text-text">{cert.expires}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-text/60">Status</span>
        <span className={cert.verified ? 'text-green-500' : 'text-yellow-500'}>
          {cert.verified ? 'Verified' : 'Pending'}
        </span>
      </div>
    </div>
  </motion.div>
);

const MentorshipCard = ({ program }: { program: MentorshipProgram }) => (
  <motion.div
    key={program.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-surface p-6 rounded-xl border border-border hover:border-primary transition-colors"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <BiUser className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-medium text-text">{program.name}</h3>
            <p className="text-sm text-text/60">with {program.mentor}</p>
          </div>
          <span
            className={`text-sm ${
              program.status === 'Active' ? 'text-green-500' : 'text-text/60'
            }`}
          >
            {program.status}
          </span>
        </div>
        <div className="space-y-2 text-sm text-text/60">
          <div className="flex items-center gap-2">
            <BiGroup className="w-4 h-4" />
            <span>{program.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <BiCalendar className="w-4 h-4" />
            <span>{program.duration}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Main Component
export default function ProfessionalDevelopmentSection() {
  return (
    <div className="space-y-8">
      {/* Learning Progress */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} cert={cert} />
          ))}
        </div>
      </section>

      {/* Mentorship Programs */}
      <section>
        <h2 className="text-lg font-semibold text-text mb-4">Mentorship Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentorshipPrograms.map((program) => (
            <MentorshipCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </div>
  );
}
