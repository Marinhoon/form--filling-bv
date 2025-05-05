export interface FormData {
    numeroConselho: string | number | readonly string[] | undefined;
    CPF: string;
    dataNascimento: string;
    nomeCompleto: string;
    unidade: string;
    id: string;
    funcao: string;
    conselho: string;
    tipoFuncao: string;
    especialidade: string;
    telefone: string;
    endereco: string;
    bairro: string;
    numero: string;
    cep: string;
    setor: string;
    dataPreenchimento: string;
    dataAdmissao: string;
  }
  
  export interface Login {
    type: string;
    login: string;
    password: string;
  }