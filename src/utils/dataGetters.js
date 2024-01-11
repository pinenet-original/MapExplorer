import { collection, getDocs, getFirestore } from "firebase/firestore";

export const getClients = async () => {
  const db = getFirestore();
  const clientsCol = collection(db, "clients");
  const clientsSnapshot = await getDocs(clientsCol);
  const clients = clientsSnapshot.docs.map((doc) => doc.data());
  // console.log(clients);
  return clients;
};
