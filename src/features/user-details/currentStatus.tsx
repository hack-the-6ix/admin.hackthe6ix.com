import { User } from '@/utils/ht6-api';

export default function CurrentStatus({ candidate }: { candidate: User }) {
  const barColour = [
    'bg-gray-300',
    'bg-primary-medlight',
    'bg-amber-400',
    'bg-red-400',
  ];
  const stages = [
    'Applying',
    'Applied',
    'Result: -',
    'Status Released',
    'Response: -',
    'Checked In',
  ];
  console.log(candidate);

  const colourIndex = [1, 0, 0, 0, 0, 0];
  if (candidate.status.applied) {
    colourIndex[1] = 1;
  }
  if (candidate.status.applicationExpired) {
    colourIndex[0] = 3;
    stages[0] = 'App Expired';
  }
  if (candidate.status.accepted) {
    colourIndex[2] = 1;
    stages[2] = 'Accepted';
  }
  if (candidate.status.waitlisted) {
    colourIndex[2] = 2;
    stages[2] = 'Waitlisted';
  }
  if (candidate.status.rejected) {
    colourIndex[2] = 3;
    stages[2] = 'Rejected';
  }
  if (candidate.status.statusReleased) {
    colourIndex[3] = 1;
  }
  if (candidate.status.confirmed) {
    colourIndex[4] = 1;
    stages[4] = 'Confirmed';
  }
  if (candidate.status.rsvpExpired) {
    colourIndex[4] = 2;
    stages[4] = 'RSVP Expired';
  }
  if (candidate.status.declined) {
    colourIndex[4] = 3;
    stages[4] = 'Declined';
  }
  if (candidate.status.checkedIn) {
    colourIndex[5] = 1;
    stages[5] = 'Checked In';
  }

  return (
    <div className="p-5 bg-white dark:bg-slate-700 rounded-2xl flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-700 dark:text-slate-200 font-medium text-lg">
          Current Status
        </h2>
      </div>

      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-4 whitespace-nowrap">
        {stages.map((stage, index) => (
          <div key={stage} className="flex-1">
            <div className="text-sm text-gray-700 dark:text-slate-200 mb-1">
              {stage}
            </div>
            <div
              className={`h-2 rounded-full ${barColour[colourIndex[index]]}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
