export const generalCertifications = [
    "Trabajo en Altura",
    "Espacios Confinados",
    "Manipulación de Alimentos",
    "Manejo de Sustancias Peligrosas",
    "Primeros Auxilios",
    "Uso y Manejo de Extintores",
    "Andamiero Calificado"
];

export const specialtyCertifications: Record<string, string[]> = {
    "Electricista": [
        "Instalador Eléctrico SEC Clase A",
        "Instalador Eléctrico SEC Clase B",
        "Instalador Eléctrico SEC Clase C",
        "Instalador Eléctrico SEC Clase D"
    ],
    "Gasfíter": [
        "Instalador de Gas SEC Clase 1",
        "Instalador de Gas SEC Clase 2",
        "Instalador de Gas SEC Clase 3",
        "Operador de Calderas"
    ],
    "Soldador": [
        "Soldador Calificado 3G",
        "Soldador Calificado 4G",
        "Soldador Calificado 6G"
    ],
    "Rigger": [
        "Rigger Alta Tonelaje",
        "Rigger Baja Tonelaje"
    ],
    "Operador de Maquinaria": [
        "Operador de Grúa Horquilla",
        "Operador de Grúa Torre",
        "Operador de Maquinaria Pesada"
    ],
    "Prevencionista de Riesgos": [
        "Prevención de Riesgos - Experto",
        "Prevención de Riesgos - Técnico"
    ]
};

export const getAllowedCertifications = (specialty: string): string[] => {
    const specific = specialtyCertifications[specialty] || [];
    return [...specific, ...generalCertifications];
};
