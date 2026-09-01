export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';


export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IProductsResponse {
    items: IProduct[];
    total: number;
}

export interface IOrderData {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}