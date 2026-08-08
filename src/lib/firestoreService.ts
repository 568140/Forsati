import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export async function saveToFirestore(collectionName: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.warn(`Firestore write error for ${collectionName}/${docId}:`, error);
  }
}

export async function deleteFromFirestore(collectionName: string, docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn(`Firestore delete error for ${collectionName}/${docId}:`, error);
  }
}

export async function fetchCollectionFromFirestore(collectionName: string): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const list: any[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() });
    });
    return list;
  } catch (error) {
    console.warn(`Firestore fetch error for ${collectionName}:`, error);
    return [];
  }
}
