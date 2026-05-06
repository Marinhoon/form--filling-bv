import React, { useState, useEffect } from "react";
import { FormData, Login } from "../../types/FormData";
import { saveFormData } from "../../services/firebase";
import { sendEmailNotification } from "../../services/emailNotification";
import { formatCPF, formatTelefone, formatDataNascimento } from "../../utils/formatters";
import { generateLogins } from "../../utils/loginGenerator";
import FormularioModal from "./FormularioModal";

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

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [showEndereco, setShowEndereco] = useState(false);
  const [, setShowTipoFuncao] = useState(false);
  const [showSetor, setShowSetor] = useState(false);
  const [generatedLogins, setGeneratedLogins] = useState<Login[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categorias = {
    atendimento: {
      nome: "Atendimento",
      icone: "📞",
      funcoes: ["Call-Center", "Recepção Emergência", "Recepção Ambulatório", "Recepção Itaigara"]
    },
    saude: {
      nome: "Saúde",
      icone: "🩺",
      funcoes: ["Médico", "Enfermeiro", "Tec. Enfermagem", "Psicólogo", "Farmacêutico", "Nutricionista", "Serviço Social", "Terapia Ocupacional", "Educação Física"]
    },
    administrativo: {
      nome: "Administrativo",
      icone: "📋",
      funcoes: ["Administrativo", "Almoxarifado", "AuxiliarFarmacia", "CCIH", "CME", "Financeiro", "Faturamento", "Recursos Humanos", "Tecnologia da Informação", "Compras", "Conveniência", "Segurança do Trabalho", "Contabilidade"]
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoria = e.target.value;
    setCategoriaSelecionada(categoria);
    setFormData(prev => ({ ...prev, funcao: "" }));
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  const getFieldError = (fieldName: string, value: string) => {
    if (!touchedFields[fieldName]) return "";
    
    if (!value) return "Campo obrigatório";
    
    if (fieldName === "CPF" && value) {
      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfPattern.test(value)) return "CPF inválido";
    }
    
    if (fieldName === "telefone" && value) {
      const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
      if (!telefonePattern.test(value)) return "Telefone inválido";
    }
    
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "CPF") formattedValue = formatCPF(value);
    else if (name === "telefone") formattedValue = formatTelefone(value);
    else if (name === "dataNascimento") formattedValue = formatDataNascimento(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (name === "funcao") {
      setShowEndereco(true);
      setShowSetor(value === "Estagiário(a)" || value === "Jovem Aprendiz");
      
      const conselhoMap: Record<string, string> = {
        "Médico": "CRM",
        "Psicólogo": "CRP",
        "Farmacêutico": "CRF",
        "Enfermeiro": "COREN",
        "Tec. Enfermagem": "COREN",
        "Terapia Ocupacional": "CREFITO",
        "Educação Física": "CREF",
        "Serviço Social": "CRESS",
        "Nutricionista": "CFN"
      };
      
      const conselho = conselhoMap[value] || "";
      setFormData((prev) => ({ ...prev, conselho, numeroConselho: "" }));
      setShowTipoFuncao(value === "Médico");
    }
  };

  const handleTipoFuncaoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, tipoFuncao: e.target.value }));
  };

  const isFormValid = () => {
    const { CPF, telefone, nomeCompleto, unidade, funcao } = formData;
    if (!nomeCompleto || !unidade || !funcao || !CPF || !telefone) return false;
    
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const telefonePattern = /^\(\d{2}\) \d{5}-\d{4}$/;
    
    return cpfPattern.test(CPF) && telefonePattern.test(telefone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allFields = ["nomeCompleto", "unidade", "funcao", "CPF", "telefone"];
    const newTouched: Record<string, boolean> = {};
    allFields.forEach(field => { newTouched[field] = true; });
    setTouchedFields(newTouched);
    
    if (!isFormValid()) {
      alert("Por favor, preencha todos os campos obrigatórios corretamente.");
      return;
    }

    setIsSending(true);
    try {
      await saveFormData(formData);
      await sendEmailNotification(formData).catch(console.error);
      
      const logins = generateLogins(formData.nomeCompleto, formData.funcao);
      setGeneratedLogins(logins);
      setShowModal(true);

      setFormData({
        nomeCompleto: "", dataNascimento: "", CPF: "", telefone: "", unidade: "",
        id: "", funcao: "", conselho: "", numeroConselho: "", tipoFuncao: "",
        especialidade: "", endereco: "", bairro: "", numero: "", cep: "", setor: "",
        dataPreenchimento: new Date().toLocaleDateString("pt-BR"), dataAdmissao: ""
      });
      setCategoriaSelecionada("");
      setShowEndereco(false);
      setShowTipoFuncao(false);
      setShowSetor(false);
      setTouchedFields({});
    } catch (error) {
      console.error("Erro ao enviar:", error);
      alert("Erro ao enviar o formulário.");
    } finally {
      setIsSending(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setGeneratedLogins([]);
  };

  const getFuncoesPorCategoria = () => {
    if (!categoriaSelecionada) return [];
    return categorias[categoriaSelecionada as keyof typeof categorias]?.funcoes || [];
  };

  // Estilos responsivos mobile-first
  const styles = {
    background: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("https://i.imgur.com/STKAA6q.jpeg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
      overflowY: "auto" as const,
      WebkitOverflowScrolling: "touch" as const,
      fontFamily: "'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    backgroundContent: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: isMobile ? "12px" : "20px"
    },
    container: {
      maxWidth: "900px",
      width: "100%",
      backgroundColor: "white",
      borderRadius: isMobile ? "16px" : "20px",
      boxShadow: "0 20px 35px -8px rgba(0,0,0,0.1)",
      overflow: "hidden",
      margin: "20px 0"
    },
    header: {
      background: "linear-gradient(135deg, #2d6a4f 0%, #1b4d3e 100%)",
      padding: isMobile ? "16px 16px 20px 16px" : "20px 24px 24px 24px",
      textAlign: "center" as const,
      color: "white"
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "8px"
    },
    logoBackground: {
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "4px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    logo: {
      width: isMobile ? "45px" : "50px",
      height: isMobile ? "45px" : "50px",
      objectFit: "contain" as const,
      display: "block"
    },
    title: {
      fontSize: isMobile ? "16px" : "18px",
      fontWeight: "700",
      marginBottom: "2px",
      fontFamily: "'Poppins', 'Inter', sans-serif"
    },
    subtitle: {
      fontSize: isMobile ? "10px" : "11px",
      opacity: 0.9,
      fontFamily: "'Poppins', 'Inter', sans-serif"
    },
    form: {
      padding: isMobile ? "16px" : "24px"
    },
    section: {
      marginBottom: isMobile ? "20px" : "24px"
    },
    sectionTitle: {
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: "700",
      color: "#1e4620",
      marginBottom: isMobile ? "10px" : "12px",
      paddingBottom: "6px",
      borderBottom: "2px solid #e2e8f0",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "'Poppins', 'Inter', sans-serif"
    },
    firstRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "12px" : "16px",
      marginBottom: isMobile ? "20px" : "24px"
    },
    personalRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "10px" : "12px",
      marginBottom: "0"
    },
    row: {
      display: "flex",
      flexDirection: isMobile ? ("column" as const) : ("row" as const),
      gap: isMobile ? "12px" : "16px",
      marginBottom: "0"
    },
    field: {
      marginBottom: "0",
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
      flex: isMobile ? "1" : "1 1 calc(50% - 8px)",
      minWidth: isMobile ? "100%" : "auto"
    },
    label: {
      fontSize: isMobile ? "11px" : "12px",
      fontWeight: "700",
      color: "#334155",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    required: {
      color: "#ef4444",
      fontSize: "10px"
    },
    input: {
      width: "100%",
      padding: isMobile ? "8px 10px" : "10px 12px",
      fontSize: isMobile ? "13px" : "14px",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      border: "1.5px solid #e2e8f0",
      borderRadius: "10px",
      transition: "all 0.2s",
      outline: "none",
      backgroundColor: "#ffffff",
      boxSizing: "border-box" as const
    },
    inputError: {
      borderColor: "#ef4444",
      backgroundColor: "#fef2f2"
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "10px",
      marginTop: "2px",
      fontFamily: "'Poppins', 'Inter', sans-serif"
    },
    select: {
      width: "100%",
      padding: isMobile ? "8px 10px" : "10px 12px",
      fontSize: isMobile ? "13px" : "14px",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      border: "1.5px solid #e2e8f0",
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      outline: "none",
      transition: "all 0.2s"
    },
    selectError: {
      borderColor: "#ef4444",
      backgroundColor: "#fef2f2"
    },
    button: {
      width: "100%",
      padding: isMobile ? "12px" : "14px",
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: "600",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      color: "white",
      background: "linear-gradient(135deg, #2d6a4f 0%, #1b4d3e 100%)",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "transform 0.15s, box-shadow 0.15s",
      marginTop: isMobile ? "16px" : "20px"
    },
    welcomeModal: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
      padding: "16px"
    },
    welcomeContent: {
      backgroundColor: "white",
      borderRadius: "24px",
      maxWidth: "480px",
      width: "100%",
      padding: isMobile ? "20px" : "28px",
      textAlign: "center" as const,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      fontFamily: "'Poppins', 'Inter', sans-serif",
      maxHeight: "90vh",
      overflowY: "auto" as const
    },
    welcomeLogo: {
      maxWidth: "200px",
      width: "100%",
      marginBottom: "20px",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    },
    welcomeText: {
      color: "#334155",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: "1.5",
      marginBottom: "12px",
      textAlign: "left" as const,
      fontFamily: "'Poppins', 'Inter', sans-serif"
    }
  };

  // Estilos globais para o scroll
  const globalStyles = `
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #2d6a4f;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #1b4d3e;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      overflow: hidden;
    }
  `;

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "#2d6a4f";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.1)";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, fieldName: string) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.boxShadow = "none";
    handleBlur(fieldName);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.background}>
        <div style={styles.backgroundContent}>
          {showWelcomeModal && (
            <div style={styles.welcomeModal}>
              <div style={styles.welcomeContent}>
                {/* Logo no lugar do emoji */}
                <img
                  src="https://www.grupobomviver.com.br/wp-content/themes/tema-bem-viver/assets/imagens/marca_bom_viver_tagline.png"
                  alt="Logo Grupo Bom Viver"
                  style={styles.welcomeLogo}
                />
                
                <h2 style={{ color: "#2d6a4f", marginBottom: "12px", fontSize: isMobile ? "20px" : "22px", fontFamily: "'Poppins', 'Inter', sans-serif" }}>
                  Bem-vindo(a) ao Grupo Bom Viver!
                </h2>
                
                <div style={{ backgroundColor: "#f0fdf4", borderRadius: "16px", padding: "14px", marginBottom: "16px" }}>
                  <p style={styles.welcomeText}>
                    Você agora faz parte do time que é <strong style={{ color: "#2d6a4f" }}>Referência em Saúde Mental</strong>.
                  </p>
                  <p style={styles.welcomeText}>
                    <strong>Nossos valores:</strong> Humanização, ética, integridade, respeito, profissionalismo, resultado sustentável e trabalho em equipe.
                  </p>
                  <p style={{ ...styles.welcomeText, marginBottom: 0 }}>
                    Conheça mais sobre nossa história:{' '}
                    <a href="https://www.grupobomviver.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#2d6a4f", fontWeight: "600", textDecoration: "none" }}>
                      www.grupobomviver.com.br
                    </a>
                  </p>
                </div>

                <button
                  onClick={() => setShowWelcomeModal(false)}
                  style={styles.button}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  Começar
                </button>
              </div>
            </div>
          )}

          <div style={styles.container}>
            <div style={styles.header}>
              <div style={styles.logoContainer}>
                <div style={styles.logoBackground}>
                  <img
                    src="https://imgur.com/ZUoGTHR.png"
                    alt="Logo Grupo Bom Viver"
                    style={styles.logo}
                  />
                </div>
              </div>
              <h1 style={styles.title}>Cadastro de Profissional</h1>
              <p style={styles.subtitle}>Preencha seus dados para criar seus acessos</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Unidade e Data */}
              <div style={styles.firstRow}>
                <div style={styles.field}>
                  <label style={styles.label}>
                    Unidade <span style={styles.required}>*</span>
                  </label>
                  <select 
                    name="unidade" 
                    value={formData.unidade} 
                    onChange={handleChange} 
                    onBlur={(e) => handleInputBlur(e, "unidade")}
                    onFocus={handleInputFocus}
                    style={{
                      ...styles.select,
                      ...(touchedFields.unidade && !formData.unidade ? styles.selectError : {})
                    }}
                  >
                    <option value="">Selecione</option>
                    <option value="BV-Consultas">BV-Consultas</option>
                    <option value="BV-Hospital">BV-Hospital</option>
                  </select>
                  {touchedFields.unidade && !formData.unidade && (
                    <span style={styles.errorMessage}>Campo obrigatório</span>
                  )}
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>
                    📅 Data de Admissão <span style={styles.required}>*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dataAdmissao" 
                    value={formData.dataAdmissao} 
                    onChange={handleChange} 
                    required 
                    style={styles.input}
                    onFocus={handleInputFocus}
                    onBlur={(e) => handleInputBlur(e, "dataAdmissao")}
                  />
                </div>
              </div>

              {/* Dados Pessoais */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <span>👤</span> Dados Pessoais
                </div>
                <div style={styles.personalRow}>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Nome completo <span style={styles.required}>*</span>
                    </label>
                    <input 
                      name="nomeCompleto" 
                      placeholder="Digite seu nome completo" 
                      value={formData.nomeCompleto} 
                      onChange={handleChange} 
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "nomeCompleto")}
                      style={{
                        ...styles.input,
                        ...(touchedFields.nomeCompleto && !formData.nomeCompleto ? styles.inputError : {})
                      }}
                    />
                    {touchedFields.nomeCompleto && !formData.nomeCompleto && (
                      <span style={styles.errorMessage}>Campo obrigatório</span>
                    )}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      CPF <span style={styles.required}>*</span>
                    </label>
                    <input 
                      name="CPF" 
                      placeholder="000.000.000-00" 
                      value={formData.CPF} 
                      onChange={handleChange} 
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "CPF")}
                      style={{
                        ...styles.input,
                        ...(touchedFields.CPF && getFieldError("CPF", formData.CPF) ? styles.inputError : {})
                      }}
                    />
                    {touchedFields.CPF && getFieldError("CPF", formData.CPF) && (
                      <span style={styles.errorMessage}>{getFieldError("CPF", formData.CPF)}</span>
                    )}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Telefone <span style={styles.required}>*</span>
                    </label>
                    <input 
                      name="telefone" 
                      placeholder="(00) 00000-0000" 
                      value={formData.telefone} 
                      onChange={handleChange} 
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "telefone")}
                      style={{
                        ...styles.input,
                        ...(touchedFields.telefone && getFieldError("telefone", formData.telefone) ? styles.inputError : {})
                      }}
                    />
                    {touchedFields.telefone && getFieldError("telefone", formData.telefone) && (
                      <span style={styles.errorMessage}>{getFieldError("telefone", formData.telefone)}</span>
                    )}
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Data de nascimento</label>
                    <input 
                      name="dataNascimento" 
                      placeholder="00/00/0000" 
                      value={formData.dataNascimento} 
                      onChange={handleChange} 
                      style={styles.input}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "dataNascimento")}
                    />
                  </div>
                </div>
              </div>

              {/* Dados da Função */}
              <div style={styles.section}>
                <div style={styles.sectionTitle}>
                  <span>💼</span> Dados da Função
                </div>
                
                <div style={styles.row}>
                  <div style={styles.field}>
                    <label style={styles.label}>
                      Categoria <span style={styles.required}>*</span>
                    </label>
                    <select 
                      value={categoriaSelecionada} 
                      onChange={handleCategoriaChange} 
                      required 
                      style={styles.select}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "categoria")}
                    >
                      <option value="">Selecione a categoria</option>
                      {Object.entries(categorias).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.icone} {cat.nome}</option>
                      ))}
                    </select>
                  </div>
                  
                  {categoriaSelecionada && (
                    <div style={styles.field}>
                      <label style={styles.label}>
                        Função <span style={styles.required}>*</span>
                      </label>
                      <select 
                        name="funcao" 
                        value={formData.funcao} 
                        onChange={handleChange} 
                        required 
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, "funcao")}
                        style={{
                          ...styles.select,
                          ...(touchedFields.funcao && !formData.funcao ? styles.selectError : {})
                        }}
                      >
                        <option value="">Selecione a função</option>
                        {getFuncoesPorCategoria().map((funcao) => (
                          <option key={funcao} value={funcao}>{funcao}</option>
                        ))}
                      </select>
                      {touchedFields.funcao && !formData.funcao && (
                        <span style={styles.errorMessage}>Campo obrigatório</span>
                      )}
                    </div>
                  )}
                </div>

                {formData.conselho && (
                  <div style={{ ...styles.field, marginTop: "12px" }}>
                    <label style={styles.label}>Número do Conselho</label>
                    <input 
                      name="numeroConselho" 
                      value={formData.numeroConselho} 
                      onChange={handleChange} 
                      placeholder={`Digite seu número ${formData.conselho}`} 
                      style={styles.input}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "numeroConselho")}
                    />
                  </div>
                )}

                {formData.funcao === "Médico" && (
                  <div style={{ ...styles.field, marginTop: "12px" }}>
                    <label style={styles.label}>Tipo de atuação</label>
                    <select 
                      name="tipoFuncao" 
                      value={formData.tipoFuncao} 
                      onChange={handleTipoFuncaoChange} 
                      style={styles.select}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "tipoFuncao")}
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="Plantão">Plantonista</option>
                      <option value="Ambulatório">Assistente</option>
                    </select>
                  </div>
                )}

                {showSetor && (
                  <div style={{ ...styles.field, marginTop: "12px" }}>
                    <label style={styles.label}>Setor de atuação</label>
                    <select 
                      name="setor" 
                      value={formData.setor} 
                      onChange={handleChange} 
                      style={styles.select}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, "setor")}
                    >
                      <option value="">Selecione o setor</option>
                      <option value="Almoxarifado">Almoxarifado</option>
                      <option value="Call-Center">Call-Center</option>
                      <option value="Enfermagem">Enfermagem</option>
                      <option value="Farmácia">Farmácia</option>
                      <option value="Faturamento">Faturamento</option>
                      <option value="Financeiro">Financeiro</option>
                      <option value="Recursos Humanos">Recursos Humanos</option>
                      <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Endereço */}
              {showEndereco && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>
                    <span>📍</span> Endereço
                  </div>
                  <div style={styles.row}>
                    <div style={styles.field}>
                      <label style={styles.label}>Endereço</label>
                      <input 
                        name="endereco" 
                        placeholder="Rua, Avenida..." 
                        value={formData.endereco} 
                        onChange={handleChange} 
                        style={styles.input}
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, "endereco")}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Bairro</label>
                      <input 
                        name="bairro" 
                        placeholder="Bairro" 
                        value={formData.bairro} 
                        onChange={handleChange} 
                        style={styles.input}
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, "bairro")}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Número</label>
                      <input 
                        name="numero" 
                        placeholder="Nº" 
                        value={formData.numero} 
                        onChange={handleChange} 
                        style={styles.input}
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, "numero")}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>CEP</label>
                      <input 
                        name="cep" 
                        placeholder="00000-000" 
                        value={formData.cep} 
                        onChange={handleChange} 
                        style={styles.input}
                        onFocus={handleInputFocus}
                        onBlur={(e) => handleInputBlur(e, "cep")}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                style={styles.button} 
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.01)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {isSending ? "Enviando..." : "Cadastrar"}
              </button>
            </form>

            {showModal && <FormularioModal logins={generatedLogins} onClose={closeModal} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FormularioEstiloGoogleForms;