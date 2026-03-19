import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8b5cf6", "#f97316", "#14b8a6"]; // Vata, Pitta, Kapha

const DoshaChart = ({ percentages }) => {
  if (!percentages) return null;

  const data = [
    { name: "Vata", value: percentages.Vata || 0 },
    { name: "Pitta", value: percentages.Pitta || 0 },
    { name: "Kapha", value: percentages.Kapha || 0 },
  ];

  return (
    <div className="w-full h-72 bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/50 rounded-2xl p-4">
      <h3 className="text-lg font-bold text-center mb-2 text-stone-700 dark:text-stone-200">
        Your Dosha Balance
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoshaChart;