import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

export default function RadarChartComponent({ data }) {

  const chartData = data || [
    { subject: "Comunicación", value: 0 },
    { subject: "Liderazgo", value: 0 },
    { subject: "Trabajo en equipo", value: 0 },
    { subject: "Creatividad", value: 0 },
    { subject: "Resolución", value: 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={chartData} outerRadius={150}>

        <PolarGrid />

        {/* 🔥 NOMBRES MÁS LEGIBLES */}
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 13, fill: "#374151" }}
        />

        {/* 🔥 ESCALA CLARA (0 a 5) */}
        <PolarRadiusAxis
          angle={30}
          domain={[0, 5]}
          tick={{ fontSize: 10 }}
        />

        {/* 🔥 RADAR MÁS PRO */}
        <Radar
          name="Habilidades"
          dataKey="value"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.5}
        />

      </RadarChart>
    </ResponsiveContainer>
  );
}