export interface ChallengeCategory { id: string; label: string; }

export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  { id: "teknologi-digital",       label: "Teknologi Digital"          },
  { id: "manufaktur-industri",     label: "Manufaktur \u0026 Industri" },
  { id: "energi",                  label: "Energi"                     },
  { id: "kesehatan",               label: "Kesehatan"                  },
  { id: "bioteknologi",            label: "Bioteknologi"               },
  { id: "logistik-rantai-pasok",   label: "Logistik \u0026 Rantai Pasok" },
  { id: "bisnis",                  label: "Bisnis"                     },
  { id: "ai-analitik-data",        label: "AI \u0026 Analitik Data"    },
  { id: "lingkungan",              label: "Lingkungan"                 },
  { id: "pertanian-pangan",        label: "Pertanian \u0026 Pangan"    },
  { id: "material-kimia",          label: "Material \u0026 Kimia"      },
  { id: "layanan-publik",          label: "Layanan Publik"             },
  { id: "transportasi",            label: "Transportasi"               },
  { id: "air-sanitasi",            label: "Air \u0026 Sanitasi"        },
  { id: "rekayasa-infrastruktur",  label: "Rekayasa \u0026 Infrastruktur" },
];