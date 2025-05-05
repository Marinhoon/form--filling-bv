import React from "react";
import { Login } from "../../types/FormData"
import { modalOverlayStyle, modalContentStyle, modalButtonStyle, descriptionStyle } from "../../styles/FormularioStyles";

interface FormularioModalProps {
  logins: Login[];
  onClose: () => void;
}

const FormularioModal: React.FC<FormularioModalProps> = ({ logins, onClose }) => {
  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Logins Gerados</h2>
        {logins.map((login, index) => (
          <div key={index}>
            <p>
              {login.type}: <strong>{login.login}</strong>
            </p>
            <p>Senha {login.type}: {login.password}</p>
            <br />
          </div>
        ))}
        <strong>
          <div style={descriptionStyle}>
            Esses logins serão válidos por até 5 dias!
          </div>
        </strong>
        <button onClick={onClose} style={modalButtonStyle}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default FormularioModal;