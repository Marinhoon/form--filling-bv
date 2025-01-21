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

    try {
      const dataToSubmit = { ...formData };
      await addDoc(collection(db, "profissionais"), dataToSubmit);

      const [firstName, ...lastNameParts] = formData.nomeCompleto.trim().split(" ");
      const lastName = lastNameParts[lastNameParts.length - 1] || "";
      const login = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
      setGeneratedLogin(login);
      alert("Formulário enviado com sucesso!");
      setShowModal(true);
        

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
    fontSize: "2rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "20px",
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
            <div style={{
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
            }}>
              <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "500px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}>
            <h2>Login Gerado</h2>
            <p>
              Login Computador: <strong>{generatedLogin}</strong>
              <p>Senha Computador: 123456</p>
            </p>
            <p>
              Login Psychi Health: <strong>{generatedLogin}</strong>
              <p>Senha Psychi Health: primeiroacesso</p>
            </p>
            <button onClick={closeModal}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            >Fechar</button>
            </div>
            </div>
          )}

      </div>
    </div>
  );
};

export default FormularioEstiloGoogleForms;
