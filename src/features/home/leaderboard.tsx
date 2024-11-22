/* eslint-disable prettier/prettier */
import { GiQueenCrown } from 'react-icons/gi';

export default function LeaderBoard({ reviewers }: { reviewers: { name: string; total: number }[] }) {
  return (
    <div className="p-6 m-4 bg-primary dark:bg-slate-700 text-center rounded-2xl">
      <h1 className="pt-2 text-2xl text-white font-bold mb-6">
        Application Review Leader Board
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-4">
        <div className="bg-primary-light dark:bg-slate-800 rounded-2xl pr-5 pl-5">
          <div className="flex justify-center gap-4 items-end h-full">
            <div className="flex flex-col items-center bg-amber-300 dark:bg-primary-dark p-4 shadow-lg rounded-t-3xl h-3/4 basis-1/3">
              <GiQueenCrown size="50px" className="mb-2 text-amber-50 dark:text-primary-light" />

              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-amber-400 dark:text-primary-dark font-bold">3</span>
              </div>
              <p className="font-bold m-2">{reviewers[2]?.name}</p>
              <div className="pr-4 pl-4 rounded-md mb-10 bg-amber-100 dark:bg-primary">
                {reviewers[2]?.total}
              </div>
            </div>

            <div className="flex flex-col items-center bg-amber-400 dark:bg-primary-dark p-4 shadow-lg h-5/6 rounded-t-3xl basis-1/3">
              <GiQueenCrown size="50px" className="mb-2 text-amber-100 dark:text-primary-light" />
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-amber-500 dark:text-primary-dark font-bold">1</span>
              </div>
              <p className="font-bold m-2">{reviewers[0]?.name}</p>
              <div className="pr-4 pl-4 rounded-md mb-10 bg-amber-200 dark:bg-primary">
                {reviewers[0]?.total}
              </div>
            </div>

            <div className="flex flex-col items-center bg-amber-500 dark:bg-primary-dark p-4 shadow-lg h-4/5 rounded-t-3xl basis-1/3">
              <GiQueenCrown size="50px" className="mb-2 text-amber-200 dark:text-primary-light" />

              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <span className="text-amber-600 dark:text-primary-dark font-bold">2</span>
              </div>
              <p className="font-bold m-2">{reviewers[1]?.name}</p>
              <div className="pr-4 pl-4 rounded-md mb-10 bg-amber-300 dark:bg-primary">
                {reviewers[1]?.total}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2 bg-primary-light dark:bg-slate-800 rounded-2xl">
          <h2 className="text-xl font-bold mt-4 text-primary-dark dark:text-slate-300">
            Remaining Reviewers
          </h2>
          <div className="m-4 space-y-4">
            {reviewers.slice(3).map((reviewer, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl"
              >
                <p className="font-bold dark:text-slate-400">
                  {index + 4}. {reviewer.name}
                </p>
                <p className="text-slate-600">{reviewer.total}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
