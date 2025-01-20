import { User } from '@/utils/ht6-api';
import Box from '@/components/box';

export default function Profile({ candidate }: { candidate: User }) {
  const personalInfo = {
    Gender: candidate.hackerApplication?.gender ?? 'Not Provided',
    Ethnicity: candidate.hackerApplication?.ethnicity ?? 'Not Provided',
    Location:
      candidate.hackerApplication?.city +
      ', ' +
      candidate.hackerApplication?.province +
      ', ' +
      candidate.hackerApplication?.country,
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
      ></Box>
    </div>
  );
}
