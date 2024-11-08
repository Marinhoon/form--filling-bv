import React from 'react';
import Formulario from './components/Formulario';

const App: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      
      <Formulario />
    </div>
  );
};

export default App;
