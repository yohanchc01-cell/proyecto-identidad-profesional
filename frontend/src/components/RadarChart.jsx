import { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

export default function RadarChartComponent() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `https://proyecto-identidad-profesional.onrender.com/api/skills/${user._id}`
      );

      const skills = res.data;

      const formatted = [
        { skill: "Comunicación", value: skills?.comunicacion || 0 },
        { skill: "Liderazgo", value: skills?.liderazgo || 0 },
        { skill: "Trabajo", value: skills?.trabajoEquipo || 0 },
        { skill: "Creatividad", value: skills?.creatividad || 0 },
        { skill: "Resolución", value: skills?.resolucion || 0 }
      ];

      setData(formatted);
    };

    fetchData();
  }, []);

  return (
    <RadarChart width={300} height={250} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="skill" />
      <PolarRadiusAxis />
      <Radar
        dataKey="value"
        stroke="#2563eb"
        fill="#3b82f6"
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}