import {
  collection,
  getDocs,
  getFirestore,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase";

export const getClients = async () => {
  const db = getFirestore();
  const clientsCol = collection(db, "clients");
  const clientsSnapshot = await getDocs(clientsCol);
  const clients = clientsSnapshot.docs.map((doc) => doc.data());
  // console.log(clients);
  return clients;
};

export const getClient = async (id) => {
  const docRef = doc(db, "clients", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return data;
};
