export function analyzeSkills(skills) {

  const getLevel = (value) => {
    if (value >= 80) return "alto";
    if (value >= 50) return "medio";
    return "bajo";
  };

  return {
    comunicacion: getLevel(skills.comunicacion),
    liderazgo: getLevel(skills.liderazgo),
    trabajoEquipo: getLevel(skills.trabajoEquipo),
    creatividad: getLevel(skills.creatividad),
    resolucion: getLevel(skills.resolucion)
  };
}