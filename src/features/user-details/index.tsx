import {
  // useLocation,
  // useNavigate,
  useParams,
  useLoaderData,
} from 'react-router';
import { getUser, getDownloadURL, User } from '@/utils/ht6-api';
import Box from '@/components/box';
import QuestionBox from '@/components/questionBox';
import { useEffect, useState } from 'react';
import CurrentStatus from './currentStatus';
import Button from '@/components/button';
import SideBarInfo from './sideBarInfo';
import { categoryNames, categoryQuestions } from '@/utils/const';
import QR from './QR';

export async function clientLoader({ params }: { params: { id: string } }) {
  const applicantsData = await getUser(1, 2, 'asc', '', '', { _id: params.id });
  const resumeLink = await getDownloadURL(
    'resumes',
    applicantsData.message[0]?.hackerApplication?.resumeFileName ?? 'null',
  );
  return {
    applicants: applicantsData.message,
    resumeLink: resumeLink.message,
  };
}

export default function UserDetails() {
  const userData = useLoaderData<{
    applicants: User[];
    resumeLink: string;
  }>();
  const [candidate, setCandidate] = useState<User>(userData.applicants[0]);
  const resumeLink = userData.resumeLink;
  const id = useParams().id;
  //const navigation = useNavigate();
  const [showQr, setShowQr] = useState(false);

  // syncing up candidate info every 10 seconds
  const fetchCandidate = async () => {
    const res = await getUser(1, 2, 'asc', '', '', { _id: id });
    setCandidate(res.message[0]);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchCandidate().catch((error: unknown) => {
        console.error(error);
      });
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // format things
  const formatter = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  const formatObject = (obj: Record<string, string>): string[] => {
    return Object.entries(obj).map(([key, value]) => `${key}: ${value}`);
  };

  // displayed data
  const adminInfo = {
    ID: candidate._id,
    'T-shirt Size': candidate.hackerApplication?.shirtSize ?? 'Not Provided',
    'Created At':
      candidate.created ?
        formatter.format(new Date(candidate.created))
      : 'Not Provided',
    'APP Open':
      candidate.computedApplicationOpen ?
        formatter.format(new Date(candidate.computedApplicationOpen))
      : 'Not Provided',
    'APP Deadline':
      candidate.computedApplicationDeadline ?
        formatter.format(new Date(candidate.computedApplicationDeadline))
      : 'Not Provided',
    'RSVP Deadline':
      candidate.computedRSVPDeadline ?
        formatter.format(new Date(candidate.computedRSVPDeadline))
      : 'Not Provided',
    'Computed Application Score':
      candidate.internal.computedApplicationScore?.toString() ?? 'Not Provided',
  };

  const categorySection = (category: string, value: string) => {
    return (
      <QuestionBox
        title={categoryNames[category as keyof typeof categoryNames]}
        label={categoryQuestions[category as keyof typeof categoryQuestions]}
        wordCount={value.split(' ').length}
      >
        {value}
      </QuestionBox>
    );
  };

  return (
    <div className="p-4 m-3">
      {showQr && (
        <QR
          onClose={() => {
            setShowQr(false);
          }}
          base64Img={candidate.checkInQR ?? ''}
        />
      )}
      <div className="mb-6 flex align-center justify-between md:flex-row flex-col">
        <h1 className="text-5xl font-bold text-primary">
          {candidate.fullName}
        </h1>
        <div className="ml-4 flex gap-3 sm:gap-4 items-end py-1">
          <Button
            className="py-1"
            onClick={() => {
              setShowQr(true);
            }}
          >
            View QR code
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-[5fr_2fr] gap-6">
        <div className="flex flex-col gap-6">
          <CurrentStatus candidate={candidate} />
          <div className="flex flex-col gap-5">
            <Box
              background={'bg-primary dark:bg-slate-600'}
              innerBackground={'bg-primary-light dark:bg-slate-700'}
              title={'Admin Info'}
              items={formatObject(adminInfo)}
              copy={[true]}
            ></Box>

            <Box
              background={'bg-blue-400 dark:bg-slate-600'}
              innerBackground={'bg-blue-200 dark:bg-slate-700'}
              title={'Past Notes'}
              items={['']}
            >
              <p className="font-normal text-black dark:text-slate-400 p-2 pl-4 pr-4 rounded-xl">
                {candidate.internal.notes !== '' ?
                  candidate.internal.notes
                : 'No notes'}
              </p>
            </Box>

            {categorySection(
              'longEssay',

              candidate.hackerApplication?.longEssay ?? 'Not Provided',
            )}
            {categorySection(
              'shortEssay',
              candidate.hackerApplication?.shortEssay ?? 'Not Provided',
            )}
            {categorySection(
              'oneSentenceEssay',
              candidate.hackerApplication?.oneSentenceEssay ?? 'Not Provided',
            )}
          </div>
        </div>
        <div>
          <SideBarInfo candidate={candidate} resumeLink={resumeLink} />
        </div>
      </div>
    </div>
  );
}
