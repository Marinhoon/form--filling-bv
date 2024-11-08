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
  });

  const [showEndereco, setShowEndereco] = useState(false);
  const [showTipoFuncao, setShowTipoFuncao] = useState(false);

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
      let conselho = "";
      if (value === "Médico") {
        conselho = "CRM";
      } else if (value === "Psicólogo") {
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
      alert("Formulário enviado com sucesso!");
      
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
      });

      setShowEndereco(false);
      setShowTipoFuncao(false);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao enviar o formulário.");
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  };

  const headerImageStyle: React.CSSProperties = {
    maxWidth: "200px",
    width: "100%",
    borderRadius: "8px 8px 0 0",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "20px 0 10px",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "#555",
    marginBottom: "20px",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.75rem",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#3CB371",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px",
  };

  return (
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
          <input
            type="text"
            id="nomeCompleto"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Nome Completo (Nome e Sobrenome)"
          />
        </div>

        <div>
          <input
            type="text"
            id="dataNascimento"
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Data de nascimento (XX/XX/XXXX)"
          />
        </div>

        <div>
          <input
            type="text"
            id="CPF"
            name="CPF"
            value={formData.CPF}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Informe seu CPF"
          />
        </div>

        <div>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Informe seu número"
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
            <option value="Recepção-IT">Recepção-IT</option>
            <option value="Recepção-BV">Recepção-BV</option>
            <option value="Médico">Médico</option>
            <option value="Psicólogo">Psicólogo(a)</option>
            <option value="Farmacêutico">Farmacêutico(a)</option>
            <option value="Ed. Física">Ed. Física</option>
            <option value="Terapia Ocupacional">Terapia Ocupacional</option>
            <option value="Enfermeiro">Enfermeiro(a)</option>
            <option value="Tec. Enfermagem">Tec. Enfermagem</option>
            <option value="Serviço Social">Serviço Social</option>
          </select>
        </div>

        {showTipoFuncao && (
          <div>
            <select
              id="tipoFuncao"
              name="tipoFuncao"
              value={formData.tipoFuncao}
              onChange={handleTipoFuncaoChange}
              required
              style={inputStyle}
            >
              <option value="">Selecione o tipo de função</option>
              <option value="Plantão">Plantonista</option>
              <option value="Ambulatório">Assistente</option>
            </select>
          </div>
        )}

        {formData.conselho && (
          <div>
            <input
              type="text"
              id="conselho"
              name="conselho"
              value={formData.conselho}
              onChange={handleChange}
              required
              style={inputStyle}
              readOnly
              placeholder="Conselho"
            />
          </div>
        )}

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
              placeholder={`Digite seu número do ${formData.conselho}`}
            />
          </div>
        )}

        {showEndereco && (
          <>
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
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="Informe o número"
              />
            </div>

            <div>
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
          </>
        )}

        <button type="submit" style={buttonStyle}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default FormularioEstiloGoogleForms;