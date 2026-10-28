import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CartItem, CeremonyBooking } from '../types';

export interface SavedOrderPayload {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: 'Dine-in' | 'Pick-up' | 'Delivery';
  notesOrTable: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    priceETB: number;
    customization?: string;
  }[];
  totalETB: number;
  status: 'received' | 'brewing' | 'ready' | 'completed';
  createdAt: string;
}

export async function saveOrderToFirestore(
  orderId: string,
  customerName: string,
  customerPhone: string,
  orderType: 'Dine-in' | 'Pick-up' | 'Delivery',
  notesOrTable: string,
  items: CartItem[],
  totalETB: number
): Promise<string> {
  const path = `orders/${orderId}`;
  const payload: SavedOrderPayload = {
    id: orderId,
    customerName: customerName.trim() || 'Guest Customer',
    customerPhone: customerPhone.trim() || 'Not provided',
    orderType,
    notesOrTable: notesOrTable.trim() || 'Counter Pickup',
    items: items.map((ci) => ({
      id: ci.item.id,
      name: ci.item.name,
      quantity: ci.quantity,
      priceETB: ci.item.priceETB * ci.quantity,
      customization: ci.customization
        ? [
            ci.customization.rueHerb ? "Tena'adam" : '',
            ci.customization.sugar ? `Sugar: ${ci.customization.sugar}` : '',
            ci.customization.milk ? `Milk: ${ci.customization.milk}` : '',
          ]
            .filter(Boolean)
            .join(', ')
        : '',
    })),
    totalETB,
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'orders', orderId), payload);
    return orderId;
  } catch (error) {
    console.error('Failed to save order to Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {
      // Return orderId so customer is not blocked even if offline
      return orderId;
    }
  }
}

export async function saveBookingToFirestore(
  bookingId: string,
  booking: CeremonyBooking
): Promise<string> {
  const path = `ceremony_bookings/${bookingId}`;
  const payload = {
    id: bookingId,
    name: booking.name.trim() || 'Guest',
    phone: booking.phone.trim() || 'Not provided',
    email: booking.email.trim() || '',
    date: booking.date,
    time: booking.time,
    guests: booking.guests,
    packageType: booking.packageType,
    specialRequests: booking.specialRequests?.trim() || '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, 'ceremony_bookings', bookingId), payload);
    return bookingId;
  } catch (error) {
    console.error('Failed to save booking to Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {
      return bookingId;
    }
  }
}
