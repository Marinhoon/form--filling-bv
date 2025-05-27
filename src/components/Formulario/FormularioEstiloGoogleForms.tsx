import React, { useState } from "react";
import { FormData, Login } from "../../types/FormData";
import { saveFormData } from "../../services/firebase";
import { sendEmailNotification } from "../../services/emailNotification";
import { formatCPF, formatTelefone, formatDataNascimento } from "../../utils/formatters";
import { generateLogins } from "../../utils/loginGenerator";
import FormularioModal from "./FormularioModal";
import {
  planoDeFundo,
  containerStyle,
  titleStyle,
  formStyle,
  inputStyle,
  buttonStyle,
  headerImageStyle,
  descriptionStyle,
  welcomeModalStyle,
  welcomeModalContentStyle,
  welcomeTextStyle,
} from "../../styles/FormularioStyles";

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
  const [generatedLogins, setGeneratedLogins] = useState<Login[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // console.log('Estado atual:', { formData, showModal, generatedLogins });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "CPF") {
      formattedValue = formatCPF(value);
    } else if (name === "telefone") {
      formattedValue = formatTelefone(value);
    } else if (name === "dataNascimento") {
      formattedValue = formatDataNascimento(value);
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
      await saveFormData(dataToSubmit);
      await sendEmailNotification(dataToSubmit).catch(console.error);

      const logins = generateLogins(formData.nomeCompleto, formData.funcao);
      // console.log('Logins gerados:', logins);
      setGeneratedLogins(logins);
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
      setShowSetor(false);
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      alert("Erro ao enviar o formulário.");
    } finally {
      setIsSending(false);
    }
  };

  const closeModal = () => {
    // console.log('Fechando modal');
    setShowModal(false);
    setGeneratedLogins([]);
  };

  return (
    <div style={planoDeFundo}>
      {/* Modal de Boas-Vindas */}
      {showWelcomeModal && (
        <div style={welcomeModalStyle}>
          <div style={welcomeModalContentStyle}>
            <h2 style={{ color: '#3CB371', marginBottom: '15px' }}>
              Bem-vindo(a) ao Grupo Bom Viver!
            </h2>
            <p style={welcomeTextStyle}>
              Você agora faz parte do time que é <strong>Referência em Saúde Mental</strong>.
            </p>
            <p style={welcomeTextStyle}>
              <strong>Nossos valores:</strong> Humanização, ética, integridade, respeito,
              profissionalismo, resultado sustentável e trabalho em equipe.
            </p>
            <p style={welcomeTextStyle}>
              Conheça mais sobre nossa história:{' '}
              <a
                href="https://www.grupobomviver.com.br"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3CB371', textDecoration: 'none' }}
              >
                www.grupobomviver.com.br
              </a>
            </p>
            <button
              onClick={() => setShowWelcomeModal(false)}
              style={{
                padding: '10px 25px',
                backgroundColor: '#3CB371',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      <div style={containerStyle}>
        <img
          src="https://bomviverssa.com.br/wp-content/themes/tema-bem-viver/assets/imagens/marca_bom_viver_tagline.png"
          alt="Imagem do formulário"
          style={headerImageStyle}
        />
        <div style={titleStyle}>Cadastro de Profissional</div>
        <div style={descriptionStyle}>
          Preencha os dados abaixo para criação dos seus acessos na unidade.
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
              <option value="Almoxarifado">Almoxarifado</option>
              <option value="Apoio-Tecnico">Apoio-Técnico</option>
              <option value="AuxiliarFarmacia">Auxiliar de Fármacia</option>
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
                <option value="Almoxarifado">Almoxarifado</option>
                <option value="Apoio-Técnico">Apoio-Técnico</option>
                <option value="Call-Center">Call-Center</option>
                <option value="CCIH">CCIH</option>
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
          <button type="submit" style={buttonStyle} disabled={!isFormValid() || isSending}>
            Enviar
          </button>
        </form>
        {showModal && <FormularioModal logins={generatedLogins} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default FormularioEstiloGoogleForms;
