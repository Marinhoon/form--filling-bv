import { Login } from "../types/FormData";

export const generateLogins = (nomeCompleto: string, funcao: string): Login[] => {
  console.log('Gerando logins para:', { nomeCompleto, funcao });

  // Validar nomeCompleto
  if (!nomeCompleto || !nomeCompleto.trim()) {
    console.error('nomeCompleto está vazio ou inválido');
    return [];
  }

  // Gerar login base (nome.sobrenome) para Computador
  const [firstName, ...lastNameParts] = nomeCompleto.trim().split(" ");
  const lastName = lastNameParts[lastNameParts.length - 1] || "";
  
  if (!firstName || !lastName) {
    console.error('Nome completo inválido, requer primeiro e último nome:', { firstName, lastName });
    return [];
  }

  const baseLogin = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  // Gerar login para TechSallus (PRIMEIRO ÚLTIMO)
  const techSallusLogin = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
  // Gerar login para Psychi Health (primeiro_último)
  const psychiHealthLogin = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
  // Gerar login para Atendimento Call-Center (primeiro)
  const callCenterLogin = firstName.toLowerCase();

  // Função para gerar senha de 4 dígitos para Call-Center
  const generateRandomPin = () => Math.floor(1000 + Math.random() * 9000).toString();

  // Definir logins com base na função
  let logins: Login[] = [];

  // Funções com Login Computador e Psychi Health
  const psychiHealthFunctions = [
    "Médico",
    "Enfermeiro",
    "Tec. Enfermagem",
    "Farmacêutico",
    "Nutricionista",
    "Psicólogo",
    "Serviço Social",
    "Terapia Ocupacional",
  ];

  // Funções com Login Computador e TechSallus
  const techSallusFunctions = [
    "Recepção-BV", // Recepcionista (Itaigara)
    "Recepção-IT", // Recepcionista (Hospital)
  ];

  // Lógica para gerar logins
  if (psychiHealthFunctions.includes(funcao)) {
    logins = [
      { type: "Computador", login: baseLogin, password: "12345678" },
      { type: "Psychi Health", login: psychiHealthLogin, password: "123456" },
    ];
  } else if (techSallusFunctions.includes(funcao)) {
    logins = [
      { type: "Computador", login: baseLogin, password: "12345678" },
      { type: "TechSallus", login: techSallusLogin, password: "123456" },
    ];
  } else if (funcao === "Call-Center") {
    const callCenterPin = generateRandomPin();
    logins = [
      { type: "Computador", login: baseLogin, password: "12345678" },
      { type: "TechSallus", login: techSallusLogin, password: "123456" },
      { type: "Atendimento Call-Center", login: callCenterLogin, password: callCenterPin },
    ];
  } else {
    // Para outras funções, apenas Login Computador
    logins = [{ type: "Computador", login: baseLogin, password: "12345678" }];
  }

  console.log('Logins retornados:', logins);
  return logins;
};