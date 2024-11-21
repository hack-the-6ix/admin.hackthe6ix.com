/* eslint-disable prettier/prettier */
import Box from '../../components/box';
import LeaderBoard from './leaderboard';

export function Component() {
  return (
    <div className="p-4 m-3">
      <div className="m-4 text-left mb-6">
        <h1 className="text-5xl font-bold text-primary">Statistics</h1>
        <p className="text-xl font-bold text-slate-500 ">
          All the numbers at a glance
        </p>
      </div>
      <LeaderBoard />

      {/* Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <Box title="Box Title">box1</Box>
        <Box>box1</Box>
        <Box>box1</Box>
        <Box>box1</Box>
      </div>
    </div>
  );
}
