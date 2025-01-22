import React, { useEffect } from 'react';
import Formulario from './components/Formulario';
import { startFirestoreListener } from '../services/firestoreListener';

const App: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  useEffect(() => {
    const unsubscribe = startFirestoreListener();

   
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={containerStyle}>
      <Formulario />
    </div>
  );
};

export default App;



// import React from 'react';
// import Formulario from './components/Formulario';

// const App: React.FC = () => {
//   const containerStyle: React.CSSProperties = {
//     textAlign: 'center',
//   };

//   return (
//     <div style={containerStyle}>
      
//       <Formulario />
//     </div>
//   );
// };

// export default App;
