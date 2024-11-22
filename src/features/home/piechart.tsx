/* eslint-disable prettier/prettier */
import { PieChart as RechartsPieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#a7c957'];

export default function PieChart({
  data,
}: {
  data: { name: string; total: number }[];
}) {
  return (
    <div className="flex items-center justify-center">
      <RechartsPieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          dataKey="total" 
      
        >
          {data.map((_entry, index) => (
            <Cell
              key={`cell-${index.toString()}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </div>
  );
}
