// lib/inventory.ts
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export function subscribeToInventory(callback: (items: InventoryItem[]) => void) {
  return onSnapshot(collection(db, "inventory"), (snapshot) => {
    const items: InventoryItem[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<InventoryItem, "id">),
    }));
    callback(items);
  });
}

export async function setInventoryItem(name: string, stock: number, price: number) {
  await setDoc(doc(db, "inventory", name), { name, stock, price });
}

export async function reduceStock(itemName: string, quantity: number) {
  const ref = doc(db, "inventory", itemName);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { stock: increment(-quantity) });
  }
}

export async function increaseStock(itemName: string, quantity: number) {
  const ref = doc(db, "inventory", itemName);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { stock: increment(quantity) });
  }
}

export async function addStock(name: string, quantity: number, price: number) {
  const ref = doc(db, "inventory", name);
  await setDoc(ref, { name, price, stock: increment(quantity) }, { merge: true });
}