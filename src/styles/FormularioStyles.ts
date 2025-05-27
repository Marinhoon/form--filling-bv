export const planoDeFundo: React.CSSProperties = {
  backgroundImage: `url("https://i.imgur.com/STKAA6q.jpeg")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const containerStyle: React.CSSProperties = {
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

export const titleStyle: React.CSSProperties = {
  fontSize: "1.2rem",
  color: "#333",
  textAlign: "center",
  marginBottom: "10px",
  fontWeight: "bold",
};

export const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  fontSize: "1rem",
  borderRadius: "5px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

export const buttonStyle: React.CSSProperties = {
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

export const headerImageStyle: React.CSSProperties = {
  maxWidth: "200px",
  width: "100%",
  borderRadius: "8px 8px 0 0",
  display: "block",
  margin: "0 auto",
  padding: "10px 0",
};

export const descriptionStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  color: "#555",
  marginBottom: "20px",
};

export const modalOverlayStyle: React.CSSProperties = {
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
};

export const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "20px",
  maxWidth: "500px",
  width: "90%",
  textAlign: "center",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
};

export const modalButtonStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "10px 20px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export const welcomeModalStyle: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export const welcomeModalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '10px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  textAlign: 'center',
  fontFamily: "'Roboto', sans-serif",
};

export const welcomeTextStyle: React.CSSProperties = {
  fontSize: '0.95rem',
  lineHeight: '1.6',
  color: '#333',
  marginBottom: '20px',
  textAlign: 'left',
  fontFamily: "'Roboto', sans-serif",
};