import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../services/irebaseConfig";

type FormData = {
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
};

const FormularioEstiloGoogleForms: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: "",
    dataNascimento: "",
    CPF: "",
    telefone: "",
    unidade: "",
    id: "",
    funcao: "",
    conselho: "",
    numeroConselho: "",
    tipoFuncao: "",
    especialidade: "",
    endereco: "",
    bairro: "",
    numero: "",
    cep: "",
    setor: "",
    dataPreenchimento: new Date().toLocaleDateString("pt-BR"),
    dataAdmissao: "",
  });

  const [showEndereco, setShowEndereco] = useState(false);
  const [, setShowTipoFuncao] = useState(false);
  const [showSetor, setShowSetor] = useState(false);
  const [generatedLogin, setGeneratedLogin] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [, setIsSending] = useState(false);

  // Função para gerar senha de 4 dígitos para Call-Center
  const generateRandomPin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const sendEmailNotification = async (formData: FormData) => {
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK5svYHLrWDRbFPDCULul9f5r9KKJpxPaWnoNpOhznrWQxO7wfIjAjr6GUXXFQ1mki/exec';
  
      const response = await fetch(SCRIPT_URL, {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "CPF") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (name === "telefone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    } else if (name === "dataNascimento") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{4})\d+?$/, "$1");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    if (name === "funcao") {
      setShowEndereco(true);
      setShowSetor(value === "Estagiário(a)");
      let conselho = "";
      if (value === "Médico") {
        conselho = "CRM";
        setShowTipoFuncao(true);
      } else {
        setShowTipoFuncao(false);
      }
      if (value === "Psicólogo") {
        conselho = "CRP";
      } else if (value === "Farmacêutico") {
        conselho = "CRF";
      } else if (value === "Enfermeiro" || value === "Tec. Enfermagem") {
        conselho = "COREN";
      } else if (value === "Terapia Ocupacional") {
        conselho = "CREFITO";
      } else if (value === "Ed. Física") {
        conselho = "CREF";
      } else if (value === "Serviço Social") {
        conselho = "CRESS";
      } else if (value === "Nutricionista") {
        conselho = "CFN";
      }

      setFormData((prevData) => ({
        ...prevData,
        conselho,
        numeroConselho: "",
      }));
      setShowTipoFuncao(conselho !== "");
    }
  };

  const handleTipoFuncaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      tipoFuncao: value,
    }));
  };

  const isFormValid = () => {
    const { CPF, telefone, nomeCompleto, unidade, funcao } = formData;
    if (!nomeCompleto || !unidade || !funcao || !CPF || !telefone) return false;

    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfPattern.test(CPF)) return false;

    const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefonePattern.test(telefone)) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    setIsSending(true);

    try {
      const dataToSubmit = { ...formData };
      await addDoc(collection(db, "profissionais"), dataToSubmit);

      await sendEmailNotification(dataToSubmit).catch(console.error);

      // Gerar login base (nome.sobrenome) para Computador
      const [firstName, ...lastNameParts] = formData.nomeCompleto.trim().split(" ");
      const lastName = lastNameParts[lastNameParts.length - 1] || "";
      const baseLogin = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      // Gerar login para TechSallus (PRIMEIRO ÚLTIMO)
      const techSallusLogin = `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
      // Gerar login para Psychi Health (primeiro_último)
      const psychiHealthLogin = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
      // Gerar login para Atendimento Call-Center (primeiro)
      const callCenterLogin = firstName.toLowerCase();

      // Definir logins com base na função
      let logins: { type: string; login: string; password: string }[] = [];
      const funcao = formData.funcao;

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
          { type: "Psychi Health", login: psychiHealthLogin, password: "primeiroacesso" },
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

      // Armazenar logins gerados no estado
      setGeneratedLogin(JSON.stringify(logins));
      alert("Formulário enviado com sucesso!");
      setShowModal(true);

      // Resetar formulário
      setFormData({
        nomeCompleto: "",
        dataNascimento: "",
        CPF: "",
        telefone: "",
        unidade: "",
        id: "",
        funcao: "",
        conselho: "",
        numeroConselho: "",
        tipoFuncao: "",
        especialidade: "",
        endereco: "",
        bairro: "",
        numero: "",
        cep: "",
        setor: "",
        dataPreenchimento: new Date().toLocaleDateString("pt-BR"),
        dataAdmissao: "",
      });
      setShowEndereco(false);
      setShowTipoFuncao(false);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao enviar o formulário.");
    } finally {
      setIsSending(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const planoDeFundo: React.CSSProperties = {
    backgroundImage: `url("https://i.imgur.com/STKAA6q.jpeg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "10px",
    fontFamily: "'Roboto', sans-serif",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
    position: "relative",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
    fontWeight: "bold",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "15px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#3CB371",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  };

  const headerImageStyle: React.CSSProperties = {
    maxWidth: "200px",
    width: "100%",
    borderRadius: "8px 8px 0 0",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "#555",
    marginBottom: "20px",
  };

  return (
    <div style={planoDeFundo}>
      <div style={containerStyle}>
        <img
          src="https://bomviverssa.com.br/wp-content/themes/tema-bem-viver/assets/imagens/marca_bom_viver_tagline.png"
          alt="Imagem do formulário"
          style={headerImageStyle}
        />
        <div style={titleStyle}>Cadastro de Profissional</div>
        <div style={descriptionStyle}>
          Olá, aqui você irá realizar o preenchimento de dados para criação de
          logins da unidade.
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <select
              id="unidade"
              name="unidade"
              value={formData.unidade}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Selecione a unidade</option>
              <option value="BV-Consultas">BV-Consultas</option>
              <option value="BV-Hospital">BV-Hospital</option>
            </select>
          </div>

          <div>
            <div style={titleStyle}>Data Admissão</div>
            <input
              type="date"
              id="dataAdmissao"
              name="dataAdmissao"
              value={formData.dataAdmissao}
              onChange={handleChange}
              placeholder="Data de Admissão"
              required
              style={inputStyle}
            />
          </div>
          <div style={titleStyle}>Dados Pessoais</div>
          <div>
            <input
              type="text"
              id="nomeCompleto"
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              placeholder="Nome Completo"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              type="text"
              id="CPF"
              name="CPF"
              value={formData.CPF}
              onChange={handleChange}
              placeholder="CPF"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="Telefone"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              type="text"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              placeholder="Data de Nascimento"
              required
              style={inputStyle}
            />
          </div>
          <div style={titleStyle}>Dados da Função</div>
          <div>
            <select
              id="funcao"
              name="funcao"
              value={formData.funcao}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Selecione sua função</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Call-Center">Call-Center</option>
              <option value="Ed. Física">Educador Físico</option>
              <option value="Estagiário(a)">Estagiário(a)</option>
              <option value="Enfermeiro">Enfermeiro(a)</option>
              <option value="Farmacêutico">Farmacêutico(a)</option>
              <option value="Médico">Médico</option>
              <option value="Nutricionista">Nutricionista</option>
              <option value="Psicólogo">Psicólogo(a)</option>
              <option value="Recepção-BV">Recepcionista (Itaigara)</option>
              <option value="Recepção-IT">Recepcionista (Hospital)</option>
              <option value="Serviço Social">Serviço Social</option>
              <option value="Tec. Enfermagem">Tec. Enfermagem</option>
              <option value="Terapia Ocupacional">Terapia Ocupacional</option>
            </select>
          </div>
          {showSetor && (
            <div>
              <select
                id="setor"
                name="setor"
                value={formData.setor}
                onChange={handleChange}
                required
                style={inputStyle}
              >
                <option value="">Selecione o setor que irá estagiar</option>
                <option value="Administração">Administração</option>
                <option value="Apoio-Técnico">Apoio-Técnico</option>
                <option value="Call-Center">Call-Center</option>
                <option value="CME">CME</option>
                <option value="Enfermagem">Enfermagem</option>
                <option value="Compras">Compras</option>
                <option value="Conveniência">Conveniência</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Estoque">Estoque</option>
                <option value="Farmácia">Farmácia</option>
                <option value="Faturamento">Faturamento</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Nutrição">Nutrição</option>
                <option value="Psicologia">Psicologia</option>
                <option value="Reccepção">Reccepção</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Segurança do Trabalho">Segurança do Trabalho</option>
                <option value="Serviço Social">Serviço Social</option>
                <option value="Tecnologia da Informação">Tecnologia da Informação</option>
              </select>
            </div>
          )}
          <div>
            {formData.funcao === "Médico" && (
              <div>
                <select
                  name="tipoFuncao"
                  value={formData.tipoFuncao}
                  onChange={handleTipoFuncaoChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Selecione o tipo da função</option>
                  <option value="Plantão">Plantonista</option>
                  <option value="Ambulatório">Assistente</option>
                </select>
              </div>
            )}
            <br />
            {formData.conselho && (
              <div>
                <input
                  type="text"
                  id="numeroConselho"
                  name="numeroConselho"
                  value={formData.numeroConselho}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder={`Digite seu número de conselho ${formData.conselho}`}
                />
              </div>
            )}
          </div>
          {showEndereco && (
            <div>
              <div>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Informe seu endereço"
                />
              </div>

              <div>
                <br />
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Informe seu bairro"
                />
              </div>

              <div>
                <br />
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Número da casa"
                />
              </div>

              <div>
                <br />
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Informe seu CEP"
                />
              </div>
            </div>
          )}
          <button type="submit" style={buttonStyle} disabled={!isFormValid()}>
            Enviar
          </button>
        </form>
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "20px",
                maxWidth: "500px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Logins Gerados</h2>
              {generatedLogin &&
                JSON.parse(generatedLogin).map(
                  (login: { type: string; login: string; password: string }, index: number) => (
                    <div key={index}>
                      <p>
                        {login.type}: <strong>{login.login}</strong>
                      </p>
                      <p>Senha {login.type}: {login.password}</p>
                      <br />
                    </div>
                  )
                )}
              <strong>
                <div style={descriptionStyle}>
                  Esses logins serão válidos por até 5 dias!
                </div>
              </strong>
              <button
                onClick={closeModal}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormularioEstiloGoogleForms;


// import { addDoc, collection } from "firebase/firestore";
// import React, { useState } from "react";
// import { db } from "../../services/irebaseConfig";

// type FormData = {
//   numeroConselho: string | number | readonly string[] | undefined;
//   CPF: string;
//   dataNascimento: string;
//   nomeCompleto: string;
//   unidade: string;
//   id: string;
//   funcao: string;
//   conselho: string;
//   tipoFuncao: string;
//   especialidade: string;
//   telefone: string;
//   endereco: string;
//   bairro: string;
//   numero: string;
//   cep: string;
//   setor: string;
//   dataPreenchimento: string;
//   dataAdmissao: string;
// };

// const FormularioEstiloGoogleForms: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     nomeCompleto: "",
//     dataNascimento: "",
//     CPF: "",
//     telefone: "",
//     unidade: "",
//     id: "",
//     funcao: "",
//     conselho: "",
//     numeroConselho: "",
//     tipoFuncao: "",
//     especialidade: "",
//     endereco: "",
//     bairro: "",
//     numero: "",
//     cep: "",
//     setor: "",
//     dataPreenchimento: new Date().toLocaleDateString("pt-BR"),
//     dataAdmissao: "",
//   });

//   const [showEndereco, setShowEndereco] = useState(false);
//   const [, setShowTipoFuncao] = useState(false);
//   const [showSetor, setShowSetor] = useState(false);
//   const [generatedLogin, setGeneratedLogin] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   const [, setIsSending] = useState(false);



//   const sendEmailNotification = async (formData: FormData) => {
//     try {
//       const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxK5svYHLrWDRbFPDCULul9f5r9KKJpxPaWnoNpOhznrWQxO7wfIjAjr6GUXXFQ1mki/exec';
  
//       // Enviar todos os campos do formData
//       const response = await fetch(SCRIPT_URL, {
//         method: 'POST',
//         mode:'no-cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           nome: formData.nomeCompleto,
//           cpf: formData.CPF,
//           telefone: formData.telefone,
//           dataNascimento: formData.dataNascimento,
//           funcao: formData.funcao,
//           unidade: formData.unidade,
//           dataAdmissao: formData.dataAdmissao,
//           dataPreenchimento: formData.dataPreenchimento,
//           conselho: formData.conselho || '',
//           numeroConselho: formData.numeroConselho || '',
//           tipoFuncao: formData.tipoFuncao || '',
//           especialidade: formData.especialidade || '',
//           endereco: formData.endereco || '',
//           bairro: formData.bairro || '',
//           cep: formData.cep || '',
//           numero: formData.numero || '',
//           setor: formData.setor || '',
//         }),
//       });

//       console.log('Requisição enviada com sucesso (no-cors)');

//       if (!response.ok) {
//         throw new Error('Falha ao enviar a notificação por e-mail');
//       }
  
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Erro ao enviar notificação:', error);
//       throw error;
//     }
//   };


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     if (name === "CPF") {
//       formattedValue = value
//         .replace(/\D/g, "")
//         .replace(/(\d{3})(\d)/, "$1.$2")
//         .replace(/(\d{3})(\d)/, "$1.$2")
//         .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
//     } else if (name === "telefone") {
//       formattedValue = value
//         .replace(/\D/g, "")
//         .replace(/(\d{2})(\d)/, "($1) $2")
//         .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
//     } else if (name === "dataNascimento") {
//       formattedValue = value
//         .replace(/\D/g, "")
//         .replace(/(\d{2})(\d)/, "$1/$2")
//         .replace(/(\d{2})(\d)/, "$1/$2")
//         .replace(/(\d{4})\d+?$/, "$1");
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: formattedValue,
//     }));

//     if (name === "funcao") {
//       setShowEndereco(true);
//       setShowSetor(value === "Estagiário(a)");
//       let conselho = "";
//       if (value === "Médico") {
//         conselho = "CRM";
//         setShowTipoFuncao(true);
//       } else {
//         setShowTipoFuncao(false);
//       }
//       if (value === "Psicólogo") {
//         conselho = "CRP";
//       } else if (value === "Farmacêutico") {
//         conselho = "CRF";
//       } else if (value === "Enfermeiro" || value === "Tec. Enfermagem") {
//         conselho = "COREN";
//       } else if (value === "Terapia Ocupacional") {
//         conselho = "CREFITO";
//       } else if (value === "Ed. Física") {
//         conselho = "CREF";
//       } else if (value === "Serviço Social") {
//         conselho = "CRESS";
//       } else if (value === "Nutricionista") {
//         conselho = "CFN";
//       }

//       setFormData((prevData) => ({
//         ...prevData,
//         conselho,
//         numeroConselho: "",
//       }));
//       setShowTipoFuncao(conselho !== "");
//     }
//   };

//   const handleTipoFuncaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData((prevData) => ({
//       ...prevData,
//       tipoFuncao: value,
//     }));
//   };


//   const isFormValid = () => {
//     const { CPF, telefone, nomeCompleto, unidade, funcao } = formData;
//     if (!nomeCompleto || !unidade || !funcao || !CPF || !telefone) return false;

//     const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
//     if (!cpfPattern.test(CPF)) return false;

//     const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
//     if (!telefonePattern.test(telefone)) return false;

//     return true;
//   };



//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isFormValid()) {
//       alert("Por favor, preencha todos os campos corretamente.");
//       return;
//     }

//     setIsSending(true);

//     try {
//       const dataToSubmit = { ...formData };
//       await addDoc(collection(db, "profissionais"), dataToSubmit);

//       await sendEmailNotification(dataToSubmit).catch(console.error);

//       const [firstName, ...lastNameParts] = formData.nomeCompleto.trim().split(" ");
//       const lastName = lastNameParts[lastNameParts.length - 1] || "";
//       const login = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
//       setGeneratedLogin(login);
//       alert("Formulário enviado com sucesso!");
//       setShowModal(true);


//       setFormData({
//         nomeCompleto: "",
//         dataNascimento: "",
//         CPF: "",
//         telefone: "",
//         unidade: "",
//         id: "",
//         funcao: "",
//         conselho: "",
//         numeroConselho: "",
//         tipoFuncao: "",
//         especialidade: "",
//         endereco: "",
//         bairro: "",
//         numero: "",
//         cep: "",
//         setor: "",
//         dataPreenchimento: new Date().toLocaleDateString("pt-BR"),
//         dataAdmissao: "",
//       });
//       setShowEndereco(false);
//       setShowTipoFuncao(false);
//     } catch (error) {
//       console.error("Erro ao enviar o formulário:", error);
//       alert("Erro ao enviar o formulário.");
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const planoDeFundo: React.CSSProperties = {
//     backgroundImage: `url("https://i.imgur.com/STKAA6q.jpeg")`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     position: "relative",
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   };

//   const containerStyle: React.CSSProperties = {
//     maxWidth: "700px",
//     margin: "0 auto",
//     padding: "30px",
//     backgroundColor: "rgba(255, 255, 255, 0.9)",
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     borderRadius: "10px",
//     fontFamily: "'Roboto', sans-serif",
//     boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)",
//     position: "relative",
//   };

//   const titleStyle: React.CSSProperties = {
//     fontSize: "1.2rem",
//     color: "#333",
//     textAlign: "center",
//     marginBottom: "10px",
//     fontWeight: "bold",
//   };

//   const formStyle: React.CSSProperties = {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1.2rem",
//   };

//   const inputStyle: React.CSSProperties = {
//     width: "100%",
//     padding: "12px",
//     fontSize: "1rem",
//     borderRadius: "5px",
//     border: "1px solid #ccc",
//     boxSizing: "border-box",
//   };

//   const buttonStyle: React.CSSProperties = {
//     padding: "15px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "white",
//     backgroundColor: "#3CB371",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     marginTop: "20px",
//   };

//   const headerImageStyle: React.CSSProperties = {
//     maxWidth: "200px",
//     width: "100%",
//     borderRadius: "8px 8px 0 0",
//   };
//   const descriptionStyle: React.CSSProperties = {
//     fontSize: "0.9rem",
//     color: "#555",
//     marginBottom: "20px",
//   };


//   return (
//     <div style={planoDeFundo}>
//       <div style={containerStyle}>
//         <img
//           src="https://bomviverssa.com.br/wp-content/themes/tema-bem-viver/assets/imagens/marca_bom_viver_tagline.png"
//           alt="Imagem do formulário"
//           style={headerImageStyle}
//         />
//         <div style={titleStyle}>Cadastro de Profissional</div>
//         <div style={descriptionStyle}>
//           Olá, aqui você irá realizar o preenchimento de dados para criação de
//           logins da unidade.
//         </div>

//         <form onSubmit={handleSubmit} style={formStyle}>
//           <div>
//             <select
//               id="unidade"
//               name="unidade"
//               value={formData.unidade}
//               onChange={handleChange}
//               required
//               style={inputStyle}
//             >
//               <option value="">Selecione a unidade</option>
//               <option value="BV-Consultas">BV-Consultas</option>
//               <option value="BV-Hospital">BV-Hospital</option>
//             </select>
//           </div>

//           <div>
//             <div style={titleStyle}>Data Admissão</div>
//             <input
//               type="date"
//               id="dataAdmissao"
//               name="dataAdmissao"
//               value={formData.dataAdmissao}
//               onChange={handleChange}
//               placeholder="Data de Admissão"
//               required
//               style={inputStyle}
//             />
//           </div>
//           <div style={titleStyle}>Dados Pessoais</div>
//           <div>
//             <input
//               type="text"
//               id="nomeCompleto"
//               name="nomeCompleto"
//               value={formData.nomeCompleto}
//               onChange={handleChange}
//               placeholder="Nome Completo"
//               required
//               style={inputStyle}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               id="CPF"
//               name="CPF"
//               value={formData.CPF}
//               onChange={handleChange}
//               placeholder="CPF"
//               required
//               style={inputStyle}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               id="telefone"
//               name="telefone"
//               value={formData.telefone}
//               onChange={handleChange}
//               placeholder="Telefone"
//               required
//               style={inputStyle}
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               id="dataNascimento"
//               name="dataNascimento"
//               value={formData.dataNascimento}
//               onChange={handleChange}
//               placeholder="Data de Nascimento"
//               required
//               style={inputStyle}
//             />
//           </div>
//           <div style={titleStyle}>Dados da Função</div>
//           <div>
//             <select
//               id="funcao"
//               name="funcao"
//               value={formData.funcao}
//               onChange={handleChange}
//               required
//               style={inputStyle}
//             >
//               <option value="">Selecione sua função</option>
//               <option value="Administrativo">Administrativo</option>
//               <option value="Call-Center">Call-Center</option>
//               <option value="Ed. Física">Educador Físico</option>
//               <option value="Estagiário(a)">Estagiário(a)</option>
//               <option value="Enfermeiro">Enfermeiro(a)</option>
//               <option value="Farmacêutico">Farmacêutico(a)</option>
//               <option value="Médico">Médico</option>
//               <option value="Nutricionista">Nutricionista</option>
//               <option value="Psicólogo">Psicólogo(a)</option>
//               <option value="Recepção-BV">Recepcionista (Itaigara)</option>
//               <option value="Recepção-IT">Recepcionista (Hospital)</option>
//               <option value="Serviço Social">Serviço Social</option>
//               <option value="Tec. Enfermagem">Tec. Enfermagem</option>
//               <option value="Terapia Ocupacional">Terapia Ocupacional</option>
//             </select>
//           </div>
//           {showSetor && (
//             <div>
//               <select
//                 id="setor"
//                 name="setor"
//                 value={formData.setor}
//                 onChange={handleChange}
//                 required
//                 style={inputStyle}
//               >
//                 <option value="">Selecione o setor que irá estagiar</option>
//                 <option value="Administração">Administração</option>
//                 <option value="Apoio-Técnico">Apoio-Técnico</option>
//                 <option value="Call-Center">Call-Center</option>
//                 <option value="CME">CME</option>
//                 <option value="Enfermagem">Enfermagem</option>
//                 <option value="Compras">Compras</option>
//                 <option value="Conveniência">Conveniência</option>
//                 <option value="Contabilidade">Contabilidade</option>
//                 <option value="Estoque">Estoque</option>
//                 <option value="Farmácia">Farmácia</option>
//                 <option value="Faturamento">Faturamento</option>
//                 <option value="Financeiro">Financeiro</option>
//                 <option value="Nutrição">Nutrição</option>
//                 <option value="Psicologia">Psicologia</option>
//                 <option value="Reccepção">Reccepção</option>
//                 <option value="Recursos Humanos">Recursos Humanos</option>
//                 <option value="Segurança do Trabalho">Segurança do Trabalho</option>
//                 <option value="Serviço Social">Serviço Social</option>
//                 <option value="Tecnologia da Informação">Tecnologia da Informação</option>
//               </select>
//             </div>
//           )}
//           <div>
//             {formData.funcao === "Médico" && (
//               <div>
//                 <select
//                   name="tipoFuncao"
//                   value={formData.tipoFuncao}
//                   onChange={handleTipoFuncaoChange}
//                   required
//                   style={inputStyle}
//                 >
//                   <option value="">Selecione o tipo da função</option>
//                   <option value="Plantão">Plantonista</option>
//                   <option value="Ambulatório">Assistente</option>
//                 </select>
//               </div>
//             )}
//             <br />
//             {formData.conselho && (
//               <div>
//                 <input
//                   type="text"
//                   id="numeroConselho"
//                   name="numeroConselho"
//                   value={formData.numeroConselho}
//                   onChange={handleChange}
//                   required
//                   style={inputStyle}
//                   placeholder={`Digite seu número de conselho ${formData.conselho}`}
//                 />
//               </div>
//             )}
//           </div>
//           {showEndereco && (
//             <div>
//               <div>
//                 <input
//                   type="text"
//                   id="endereco"
//                   name="endereco"
//                   value={formData.endereco}
//                   onChange={handleChange}
//                   required
//                   style={inputStyle}
//                   placeholder="Informe seu endereço"
//                 />
//               </div>

//               <div>
//                 <br />
//                 <input
//                   type="text"
//                   id="bairro"
//                   name="bairro"
//                   value={formData.bairro}
//                   onChange={handleChange}
//                   required
//                   style={inputStyle}
//                   placeholder="Informe seu bairro"
//                 />
//               </div>

//               <div>
//                 <br />
//                 <input
//                   type="text"
//                   id="numero"
//                   name="numero"
//                   value={formData.numero}
//                   onChange={handleChange}
//                   required
//                   style={inputStyle}
//                   placeholder="Número da casa"
//                 />
//               </div>

//               <div>
//                 <br />
//                 <input
//                   type="text"
//                   id="cep"
//                   name="cep"
//                   value={formData.cep}
//                   onChange={handleChange}
//                   required
//                   style={inputStyle}
//                   placeholder="Informe seu CEP"
//                 />
//               </div>
//             </div>
//           )}
//           <button type="submit" style={buttonStyle} disabled={!isFormValid()}>
//             Enviar
//           </button>
//         </form>
//         {showModal && (
//           <div style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}>
//             <div style={{
//               backgroundColor: "white",
//               borderRadius: "8px",
//               padding: "20px",
//               maxWidth: "500px",
//               width: "90%",
//               textAlign: "center",
//               boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
//             }}>
//               <h2>Login Gerado</h2>
//               <p>
//                 Login Computador: <strong>{generatedLogin}</strong>
//                 <p>Senha Computador: 12345678</p>
//               </p>
//               <br />
//               <p>
//                 Login Psychi Health: <strong>{generatedLogin?.replace('.', '_')}</strong>
//                 <p>Senha Psychi Health: primeiroacesso</p>
//               </p>
//               <br />
//               <strong><div style={descriptionStyle}>
//                 Esse login será válido em até 5 dias!
//               </div> </strong>
//               <button onClick={closeModal}
//                 style={{
//                   marginTop: "20px",
//                   padding: "10px 20px",
//                   background: "#007bff",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "5px",
//                   cursor: "pointer",
//                 }}
//               >Fechar</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FormularioEstiloGoogleForms;
