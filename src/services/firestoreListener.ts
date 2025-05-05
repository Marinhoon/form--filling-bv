import { onSnapshot, collection } from "firebase/firestore";
import axios from "axios";
import { db } from "../services/irebaseConfig";

// Função para inicializar o monitoramento
export const startFirestoreListener = () => {
  const collectionRef = collection(db, "cadastro-profissional");

  // Listener para monitorar novos documentos
  const unsubscribe = onSnapshot(collectionRef, async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        const novoDado = change.doc.data(); 

        console.log("Novo documento adicionado:", novoDado);

        // Configuração da API do GLPI
        const glpiURL = "https://suporte.ti.bomviverssa.com.br/apirest.php/";
        const apiToken = "1A6gFIprUjWN3UPtqcesVPz4A7Ky9x3lXMH1iQnU";

        try {
          const response = await axios.post(
            glpiURL,
            {
              input: {
                name: `Novo alerta: ${novoDado.nome}`, 
                content: `Detalhes do novo dado: ${JSON.stringify(novoDado)}`, 
                urgency: 3, 
                impact: 2,
                status: 1,
              },
            },
            {
              headers: {
                "Content-Type": "application/json",
                "App-Token": apiToken,
              },
            }
          );

          console.log("Ticket criado no GLPI:", response.data);
        } catch (error) {
          console.error("Erro ao criar ticket no GLPI:", error);
        }
      }
    });
  });

  return unsubscribe;
};

export { db };
