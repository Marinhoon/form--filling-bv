import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firestoreListener";
import { FormData } from "../types/FormData";

export const saveFormData = async (data: FormData) => {
  try {
    await addDoc(collection(db, "profissionais"), data);
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error);
    throw error;
  }
};