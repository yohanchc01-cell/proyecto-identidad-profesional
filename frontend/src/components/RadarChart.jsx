import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";

export default function RadarChartComponent({ data }) {
  const chartData = data || [
    { subject: "Comunicación", value: 80 },
    { subject: "Liderazgo", value: 70 },
    { subject: "Trabajo en equipo", value: 85 },
    { subject: "Creatividad", value: 75 },
    { subject: "Resolución", value: 80 }
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={chartData} outerRadius="70%">
        
        <PolarGrid />

        {/* 🔥 AQUÍ ESTÁ LA CLAVE */}
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fontSize: 12 }} 
        />

        <PolarRadiusAxis />

        <Radar
          dataKey="value"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}