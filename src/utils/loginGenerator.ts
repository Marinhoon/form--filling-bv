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
  const loginBase = `${firstName}.${lastName}`; // Padrão com ponto para todos
  const loginTechSallus = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  const loginCallCenter = firstName;

  // Apenas para (médicos) usa underline computador
  const loginMedicos = `${firstName}_${lastName}`;

  // Apenas para Psychi Health (médicos) usa underline
  const loginPsychiHealth = `${firstName}_${lastName}`;

  const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Lista de funções médicas
  const funcoesMedicas = ["Médico"]; // Apenas médicos usam _ no Psychi Health

  // Outras funções de saúde (usam ponto em todos)
  const outrasFuncoesSaude = [
    "Enfermeiro",
    "Tec. Enfermagem",
    "Farmacêutico",
    "Nutricionista",
    "Psicólogo",
    "Serviço Social",
    "Terapia Ocupacional",
  ];

  const techSallusFunctions = ["Recepção-BV", "Recepção-IT"];

  if (funcoesMedicas.includes(funcao)) {
    return [
      { type: "Computador", login: loginMedicos, password: "12345678" }, // com ponto
      {
        type: "Psychi Health",
        login: loginPsychiHealth,
        password: "primeiroacesso",
      }, // com underline
    ];
  } else if (outrasFuncoesSaude.includes(funcao)) {
    return [
      { type: "Computador", login: loginBase, password: "12345678" }, // com ponto
      { type: "Psychi Health", login: loginBase, password: "primeiroacesso" }, // também com ponto
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

// import { Login } from "../types/FormData";

// // Função para remover acentos e caracteres especiais
// const removeAcentos = (str: string): string => {
//   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// };

// export const generateLogins = (nomeCompleto: string, funcao: string): Login[] => {
//   console.log('Gerando logins para:', { nomeCompleto, funcao });

//   // Validar nomeCompleto
//   if (!nomeCompleto || !nomeCompleto.trim()) {
//     console.error('nomeCompleto está vazio ou inválido');
//     return [];
//   }

//   // Normalizar nome (remover acentos e converter para minúsculas)
//   const nomeNormalizado = removeAcentos(nomeCompleto.trim().toLowerCase());

//   // Gerar login base (nome.sobrenome) para Computador
//   const [firstName, ...lastNameParts] = nomeNormalizado.split(" ");
//   const lastName = lastNameParts[lastNameParts.length - 1] || "";

//   if (!firstName || !lastName) {
//     console.error('Nome completo inválido, requer primeiro e último nome:', { firstName, lastName });
//     return [];
//   }

//   const baseLogin = `${firstName}.${lastName}`;
//   // Gerar login para TechSallus (PRIMEIRO ÚLTIMO)
//   const techSallusLogin = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
//   // Gerar login para Psychi Health (primeiro_último)
//   const psychiHealthLogin = `${firstName}_${lastName}`;
//   // Gerar login para Atendimento Call-Center (primeiro)
//   const callCenterLogin = firstName;

//   // Função para gerar senha de 4 dígitos para Call-Center
//   const generateRandomPin = () => Math.floor(1000 + Math.random() * 9000).toString();

//   // Definir logins com base na função
//   let logins: Login[] = [];

//   // Funções com Login Computador e Psychi Health
//   const psychiHealthFunctions = [
//     "Médico",
//     "Enfermeiro",
//     "Tec. Enfermagem",
//     "Farmacêutico",
//     "Nutricionista",
//     "Psicólogo",
//     "Serviço Social",
//     "Terapia Ocupacional",
//   ];

//   // Funções com Login Computador e TechSallus
//   const techSallusFunctions = [
//     "Recepção-BV", // Recepcionista (Itaigara)
//     "Recepção-IT", // Recepcionista (Hospital)
//   ];

//   // Lógica para gerar logins
//   if (psychiHealthFunctions.includes(funcao)) {
//     logins = [
//       { type: "Computador", login: baseLogin, password: "12345678" },
//       { type: "Psychi Health", login: psychiHealthLogin, password: "primeiroacesso" },
//     ];
//   } else if (techSallusFunctions.includes(funcao)) {
//     logins = [
//       { type: "Computador", login: baseLogin, password: "12345678" },
//       { type: "TechSallus", login: techSallusLogin, password: "123456" },
//     ];
//   } else if (funcao === "Call-Center") {
//     const callCenterPin = generateRandomPin();
//     logins = [
//       { type: "Computador", login: baseLogin, password: "12345678" },
//       { type: "TechSallus", login: techSallusLogin, password: "123456" },
//       { type: "Atendimento Call-Center", login: callCenterLogin, password: callCenterPin },
//     ];
//   } else {
//     // Para outras funções, apenas Login Computador
//     logins = [{ type: "Computador", login: baseLogin, password: "12345678" }];
//   }

//   console.log('Logins retornados:', logins);
//   return logins;
// };
