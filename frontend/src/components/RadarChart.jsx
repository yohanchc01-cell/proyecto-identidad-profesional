import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const RadarChartComponent = ({ data }) => {
  const labelMap = {
    pedagogia: "Pedagogía",
    anatomia: "Anatomía",
    planificacion: "Planificación",
    primerosAuxilios: "1ros Auxilios",
    liderazgoEquipo: "Liderazgo",
    evaluacionFisica: "Evaluación",
    eticaDeportiva: "Ética",
  };

  const chartData = (data || []).map((item) => ({
    ...item,
    subject: labelMap[item.subject] || item.subject,
  }));

  if (!chartData.length) return <div className="h-64 flex items-center justify-center text-gray-400 italic">Sin datos registrados</div>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B7280", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
          <Radar
            name="Habilidades"
            dataKey="value"
            stroke="#5D5FEF"
            fill="#5D5FEF"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;