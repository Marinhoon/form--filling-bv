import React from "react";
import { Login } from "../../types/FormData";
import {
  modalOverlayStyle,
  modalContentStyle,
  descriptionStyle,
} from "../../styles/FormularioStyles";

// Ícones e cores por tipo
const typeConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  Computador: {
    icon: "💻",
    color: "#4caf50",
    bgColor: "#e8f5e9"
  },
  "Psychi Health": {
    icon: "🧠",
    color: "#2196f3",
    bgColor: "#e3f2fd"
  },
  TechSallus: {
    icon: "🏥",
    color: "#ff9800",
    bgColor: "#fff3e0"
  },
  "Call-Center": {
    icon: "📞",
    color: "#9c27b0",
    bgColor: "#f3e5f5"
  },
  "Atendimento Call-Center": {
    icon: "🎧",
    color: "#e91e63",
    bgColor: "#fce4ec"
  }
};

interface FormularioModalProps {
  logins: Login[];
  onClose: () => void;
}

const FormularioModal: React.FC<FormularioModalProps> = ({ logins, onClose }) => {
  console.log("Modal recebeu logins:", logins); // Debug

  // Se não tiver logins, mostra mensagem de erro
  if (!logins || logins.length === 0) {
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h2 style={{ 
            textAlign: "center", 
            marginBottom: "10px", 
            color: "#d32f2f",
            fontSize: "1.8rem",
            fontWeight: "bold"
          }}>
            ⚠️ Erro ao Gerar Logins
          </h2>
          
          <p style={{ 
            textAlign: "center", 
            marginBottom: "25px", 
            color: "#666",
            fontSize: "0.9rem"
          }}>
            Não foi possível gerar os logins. Verifique se o nome completo foi preenchido corretamente.
          </p>

          <button
            onClick={onClose}
            style={{
              display: "block",
              margin: "20px auto 0",
              padding: "12px 30px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "8px",
              backgroundColor: "#3CB371",
              color: "#fff",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2d8a5a"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#3CB371"}
          >
            ✖️ Fechar
          </button>
        </div>
      </div>
    );
  }

  const groupedLogins = logins.reduce((acc: Record<string, Login[]>, login) => {
    if (!acc[login.type]) acc[login.type] = [];
    acc[login.type].push(login);
    return acc;
  }, {});

  // Função para copiar texto
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copiado: ${text}`);
    } catch (err) {
      alert("Erro ao copiar. Selecione o texto manualmente.");
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "10px", 
          color: "#2d6a4f",
          fontSize: "1.8rem",
          fontWeight: "bold"
        }}>
          🔐 Logins Gerados
        </h2>
        
        <p style={{ 
          textAlign: "center", 
          marginBottom: "25px", 
          color: "#666",
          fontSize: "0.9rem"
        }}>
          Seus acessos foram criados com sucesso!
        </p>

        {Object.entries(groupedLogins).map(([type, loginsOfType]) => {
          const config = typeConfig[type] || { 
            icon: "🔹", 
            color: "#666", 
            bgColor: "#f5f5f5" 
          };
          
          return (
            <div key={type} style={{ marginBottom: "25px" }}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: config.color,
                  marginBottom: "12px",
                  fontSize: "1.2rem",
                  borderBottom: `2px solid ${config.color}20`,
                  paddingBottom: "8px"
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{config.icon}</span>
                {type}
              </h3>

              {loginsOfType.map((login, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: config.bgColor,
                    padding: "14px 18px",
                    borderRadius: "12px",
                    marginTop: "10px",
                    borderLeft: `4px solid ${config.color}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(5px)";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 5px 0" }}>
                        <strong style={{ color: "#333" }}>👤 Login:</strong>{" "}
                        <span 
                          style={{ 
                            fontFamily: "monospace", 
                            fontSize: "0.95rem",
                            backgroundColor: "white",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}
                          onClick={() => copyToClipboard(login.login, "Login")}
                          style={{ cursor: "pointer" }}
                        >
                          {login.login}
                        </span>
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong style={{ color: "#333" }}>🔑 Senha:</strong>{" "}
                        <span 
                          style={{ 
                            fontFamily: "monospace", 
                            fontSize: "0.95rem",
                            backgroundColor: "white",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}
                        >
                          {login.password}
                        </span>
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => copyToClipboard(login.login, "Login")}
                        style={{
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          backgroundColor: config.color,
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        📋 Copiar Login
                      </button>
                      <button
                        onClick={() => copyToClipboard(login.password, "Senha")}
                        style={{
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          backgroundColor: config.color,
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          transition: "opacity 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        🔑 Copiar Senha
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div
          style={{
            ...descriptionStyle,
            marginTop: "20px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#e65100",
            backgroundColor: "#fff3e0",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "0.85rem"
          }}
        >
          ⏰ Atenção: Esse login será válidado em até 5 dias!
        </div>

        <button
          onClick={onClose}
          style={{
            display: "block",
            margin: "20px auto 0",
            padding: "12px 30px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            backgroundColor: "#3CB371",
            color: "#fff",
            cursor: "pointer",
            border: "none",
            transition: "all 0.3s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#2d8a5a";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3CB371";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✖️ Fechar
        </button>
      </div>
    </div>
  );
};

export default FormularioModal;