// lib/orders.ts
// Shared order functions - used by BOTH Hotel (create orders) and Logistics (view/update orders)
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export type OrderStatus = "Processing" | "Confirmed" | "Shipped" | "Delivered";

export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  hotelEmail: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: any;
}

export async function createOrder(
  hotelEmail: string,
  items: OrderItem[],
  total: number,
  paymentMethod: string
) {
  await addDoc(collection(db, "orders"), {
    hotelEmail,
    items,
    total,
    paymentMethod,
    status: "Processing",
    createdAt: serverTimestamp(),
  });
}

export function subscribeToAllOrders(callback: (orders: Order[]) => void) {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Order, "id">),
    }));
    callback(orders);
  });
}

export function subscribeToMyOrders(
  hotelEmail: string,
  callback: (orders: Order[]) => void
) {
  const q = query(
    collection(db, "orders"),
    where("hotelEmail", "==", hotelEmail),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Order, "id">),
    }));
    callback(orders);
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(doc(db, "orders", orderId), { status });
}

export async function deleteOrder(orderId: string) {
  await deleteDoc(doc(db, "orders", orderId));
}