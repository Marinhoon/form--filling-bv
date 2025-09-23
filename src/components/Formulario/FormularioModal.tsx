import React from "react";
import { Login } from "../../types/FormData";
import {
  modalOverlayStyle,
  modalContentStyle,
  modalButtonStyle,
  descriptionStyle,
} from "../../styles/FormularioStyles";

// Ícones simples usando emojis (você pode trocar por ícones reais depois)
const typeIcons: Record<string, string> = {
  Computador: "💻",
  "Psychi Health": "🧠",
  TechSallus: "🏥",
  "Call-Center": "📞",
};

// Cores diferentes por tipo
const typeColors: Record<string, string> = {
  Computador: "#4caf50",
  "Psychi Health": "#2196f3",
  TechSallus: "#ff9800",
  "Call-Center": "#9c27b0",
};

interface FormularioModalProps {
  logins: Login[];
  onClose: () => void;
}

const FormularioModal: React.FC<FormularioModalProps> = ({ logins, onClose }) => {
  const groupedLogins = logins.reduce((acc: Record<string, Login[]>, login) => {
    if (!acc[login.type]) acc[login.type] = [];
    acc[login.type].push(login);
    return acc;
  }, {});

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          Logins Gerados
        </h2>

        {Object.keys(groupedLogins).length === 0 && (
          <p style={{ textAlign: "center" }}>Nenhum login gerado!</p>
        )}

        {Object.entries(groupedLogins).map(([type, loginsOfType]) => (
          <div key={type} style={{ marginBottom: "25px" }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: typeColors[type] || "#000",
              }}
            >
              {typeIcons[type] || "🔹"} {type}
            </h3>

            {loginsOfType.map((login, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  marginTop: "8px",
                  borderLeft: `5px solid ${typeColors[type] || "#000"}`,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Login:</strong> {login.login}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Senha:</strong> {login.password}
                </p>
              </div>
            ))}
          </div>
        ))}

        <div
          style={{
            ...descriptionStyle,
            marginTop: "15px",
            textAlign: "center",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Esse login será válido em até 5 dias!
        </div>

        <button
          onClick={onClose}
          style={{
            ...modalButtonStyle,
            display: "block",
            margin: "20px auto 0",
            padding: "12px 25px",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            backgroundColor: "#3CB371",
            color: "#fff",
            cursor: "pointer",
            border: "none",
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default FormularioModal;
