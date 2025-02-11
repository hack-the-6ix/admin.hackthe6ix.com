import { User } from '@/utils/ht6-api';
import Box from '@/components/box';

export default function FullProfile({ candidate }: { candidate: User }) {
  const personalInfo = {
    Name: candidate.fullName,
    Gender: candidate.hackerApplication?.gender ?? 'Not Provided',
    Ethnicity: candidate.hackerApplication?.ethnicity ?? 'Not Provided',
    Location:
      (candidate.hackerApplication?.city ?? 'Not Provided') +
      ', ' +
      (candidate.hackerApplication?.province ?? 'Not Provided') +
      ', ' +
      (candidate.hackerApplication?.country ?? 'Not Provided'),
  };

  const education = {
    School: (candidate.hackerApplication?.school ?? 'Not Provided').toString(),
    Program: (
      candidate.hackerApplication?.program ?? 'Not Provided'
    ).toString(),
    Level: (
      candidate.hackerApplication?.levelOfStudy ?? 'Not Provided'
    ).toString(),
    Graduation: (
      candidate.hackerApplication?.graduationYear ?? 'Not Provided'
    ).toString(),
  };

  const experience = {
    Hackathons:
      candidate.hackerApplication?.hackathonsAttended ?? 'Not Provided',
    Resume: candidate.hackerApplication?.resumeFileName ?? 'Not Provided',
    GitHub:
      candidate.hackerApplication?.githubLink ?
        `<a href="${candidate.hackerApplication.githubLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${candidate.hackerApplication.githubLink}</a>`
      : 'Not Provided',
    Portfolio:
      candidate.hackerApplication?.portfolioLink ?
        `<a href="${candidate.hackerApplication.portfolioLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${candidate.hackerApplication.portfolioLink}</a>`
      : 'Not Provided',
    LinkedIn:
      candidate.hackerApplication?.linkedinLink ?
        `<a href="${candidate.hackerApplication.linkedinLink}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${candidate.hackerApplication.linkedinLink}</a>`
      : 'Not Provided',
  };

  const formatObject = (obj: Record<string, string>): string[] => {
    return Object.entries(obj).map(([key, value]) => `${key}: ${value}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <Box
        background={'bg-sky-300 dark:bg-slate-600'}
        innerBackground={'bg-sky-200 dark:bg-slate-700'}
        title={'Personal Info'}
        items={formatObject(personalInfo)}
      ></Box>
      <Box
        background={'bg-blue-300 dark:bg-slate-600'}
        innerBackground={'bg-blue-200 dark:bg-slate-700'}
        title={'Education'}
        items={formatObject(education)}
      ></Box>
      <Box
        background={'bg-indigo-300 dark:bg-slate-600'}
        innerBackground={'bg-indigo-200 dark:bg-slate-700'}
        title={'Experience'}
        items={formatObject(experience)}
        allowHTML={true}
      ></Box>
    </div>
  );
}
