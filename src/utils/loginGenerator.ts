import { Login } from "../types/FormData";

const removeAcentos = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const generateLogins = (
  nomeCompleto: string,
  funcao: string
): Login[] => {
  console.log("Gerando logins para:", { nomeCompleto, funcao });
  
  if (!nomeCompleto?.trim()) {
    console.log("Nome completo vazio");
    return [];
  }

  // Normaliza e separa nome/sobrenome
  const nomeNormalizado = removeAcentos(nomeCompleto.trim().toLowerCase());
  const partes = nomeNormalizado.split(" ");
  const firstName = partes[0] || "";
  const lastName = partes.length > 1 ? partes[partes.length - 1] : "";
  
  console.log("Nome processado:", { firstName, lastName });

  if (!firstName || !lastName) {
    console.log("Nome ou sobrenome faltando");
    return [];
  }

  // Gera os logins base
  const loginBase = `${firstName}.${lastName}`;
  const loginTechSallus = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  const loginCallCenter = firstName;
  const loginUnderline = `${firstName}_${lastName}`;

  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Lista de funções médicas
  const funcoesMedicas = ["Médido"];

  // Funções de saúde que terão acesso ao TechSallus + Psychi Health
  const funcoesComTechSallus = [
    "Enfermeiro",
    "Farmacêutico",
    "Nutricionista",
    "Psicólogo",
    "Serviço Social",
    "Terapia Ocupacional",
    "Fisioterapeuta",
  ];

  // Funções de saúde que NÃO terão TechSallus (apenas Computador + Psychi Health)
  const funcoesSemTechSallus = [
    "Tec. Enfermagem",
  ];

  // Funções administrativas
  const techSallusFunctions = [
    "Recepção-BV",
    "Recepção-IT",
    "AuxiliarFarmacia",
    "farmacia",
    "Administrativo",
    "RH",
    "Financeiro",
    "Faturamento",
    "TI",
    "Contabilidade",
    "Almoxarifado",
    "Tecnologia da Informação",
    "Recursos Humanos",
    "Compras",
    "Conveniência",
    "Segurança do Trabalho",
    "CCIH",
    "CME",
  ];

  let logins: Login[] = [];

  // ============================================
  // ATENDIMENTO - CALL CENTER
  // ============================================
  if (funcao === "Call-Center") {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
      { type: "Leucontroll", login: loginCallCenter, password: generatePin() },
    ];
  } 
  // ============================================
  // ATENDIMENTO - RECEPÇÕES
  // ============================================
  else if (funcao === "Recepção Emergência" || 
           funcao === "Recepção Ambulatório" || 
           funcao === "Recepção Itaigara") {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
    ];
  }
  // ============================================
  // MÉDICOS
  // ============================================
  else if (funcoesMedicas.includes(funcao)) {
    logins = [
      { type: "Computador", login: loginUnderline, password: "12345678" },
      { type: "Psychi Health", login: loginUnderline, password: "primeiroacesso" },
    ];
  } 
  // ============================================
  // ENFERMEIROS (com TechSallus + Psychi Health)
  // ============================================
  else if (funcao === "Enfermeiro") {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "Psychi Health", login: loginUnderline, password: "primeiroacesso" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
    ];
  }
  // ============================================
  // TEC. ENFERMAGEM (sem TechSallus)
  // ============================================
  else if (funcoesSemTechSallus.includes(funcao)) {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "Psychi Health", login: loginUnderline, password: "primeiroacesso" },
    ];
  }
  // ============================================
  // OUTRAS FUNÇÕES DE SAÚDE (com TechSallus + Psychi Health)
  // ============================================
  else if (funcoesComTechSallus.includes(funcao)) {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "Psychi Health", login: loginUnderline, password: "primeiroacesso" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
    ];
  } 
  // ============================================
  // FUNÇÕES ADMINISTRATIVAS
  // ============================================
  else if (techSallusFunctions.includes(funcao)) {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
    ];
  } 
  // ============================================
  // FALLBACK
  // ============================================
  else {
    logins = [
      { type: "Computador", login: loginBase, password: "12345678" },
    ];
  }

  console.log("Logins gerados:", logins);
  return logins;
};