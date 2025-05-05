import { FormData } from "../types/FormData";

export const sendEmailNotification = async (formData: FormData) => {
  try {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK5svYHLrWDRbFPDCULul9f5r9KKJpxPaWnoNpOhznrWQxO7wfIjAjr6GUXXFQ1mki/exec';

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: formData.nomeCompleto,
        cpf: formData.CPF,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento,
        funcao: formData.funcao,
        unidade: formData.unidade,
        dataAdmissao: formData.dataAdmissao,
        dataPreenchimento: formData.dataPreenchimento,
        conselho: formData.conselho || '',
        numeroConselho: formData.numeroConselho || '',
        tipoFuncao: formData.tipoFuncao || '',
        especialidade: formData.especialidade || '',
        endereco: formData.endereco || '',
        bairro: formData.bairro || '',
        cep: formData.cep || '',
        numero: formData.numero || '',
        setor: formData.setor || '',
      }),
    });

    console.log('Requisição enviada com sucesso (no-cors)');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    throw error;
  }
};