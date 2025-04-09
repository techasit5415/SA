import { writable } from 'svelte/store';
export interface Order {
    id: string;
    items: any[];
    total: number;
    date: Date;
    paymentMethod: string;
    startTime: number;  // เพิ่ม timestamp เริ่มต้น
    duration: number;   // เพิ่มระยะเวลาทั้งหมด (วินาที)
}

export const orderHistory = writable<Order[]>([]);