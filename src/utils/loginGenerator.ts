import { Login } from "../types/FormData";

const removeAcentos = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const generateLogins = (
  nomeCompleto: string,
  funcao: string
): Login[] => {
  if (!nomeCompleto?.trim()) return [];

  // Normaliza e separa nome/sobrenome
  const nomeNormalizado = removeAcentos(nomeCompleto.trim().toLowerCase());
  const [firstName, ...lastNameParts] = nomeNormalizado.split(" ");
  const lastName = lastNameParts[lastNameParts.length - 1] || "";

  if (!firstName || !lastName) return [];

  // Gera os logins base
  const loginBase = `${firstName}.${lastName}`; // padrão com ponto
  const loginTechSallus = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  const loginCallCenter = firstName;

  // Logins com underline
  const loginMedicos = `${firstName}_${lastName}`;
  const loginPsychiHealth = `${firstName}_${lastName}`;

  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Lista de funções médicas
  const funcoesMedicas = ["Médico"]; // médicos usam _ em todos logins

  // Outras funções de saúde
  const outrasFuncoesSaude = [
    "Enfermeiro",
    "Tec. Enfermagem",
    "Farmacêutico",
    "Nutricionista",
    "Psicólogo",
    "Serviço Social",
    "Terapia Ocupacional",
  ];

  const techSallusFunctions = ["Recepção-BV", "Recepção-IT", "AuxiliarFarmacia"];

  if (funcoesMedicas.includes(funcao)) {
    return [
      { type: "Computador", login: loginMedicos, password: "12345678" }, // underline
      { type: "Psychi Health", login: loginPsychiHealth, password: "primeiroacesso" }, // underline
    ];
  } else if (outrasFuncoesSaude.includes(funcao)) {
    return [
      { type: "Computador", login: loginBase, password: "12345678" }, // ponto
      { type: "Psychi Health", login: loginPsychiHealth, password: "primeiroacesso" }, // underline
    ];
  } else if (techSallusFunctions.includes(funcao)) {
    return [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
    ];
  } else if (funcao === "Call-Center") {
    return [
      { type: "Computador", login: loginBase, password: "12345678" },
      { type: "TechSallus", login: loginTechSallus, password: "123456" },
      {
        type: "Atendimento Call-Center",
        login: loginCallCenter,
        password: generatePin(),
      },
    ];
  }

  return [{ type: "Computador", login: loginBase, password: "12345678" }];
};