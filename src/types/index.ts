export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


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
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
    items: IProduct[];
    total: number;
}

export interface IOrderData extends IBuyer {
    payment: TPayment;
    items: string[];
    total: number;
}

export interface IOrderResponse {
    id: string;
    total: number;
}


export interface ICardState {
    id: string;
    title: string;
    category: string;
    price: number | null;
    image: string;
    text?: string;
    index?: number;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IBasketState {
    items: HTMLElement[];
    total: number;
}

export interface ISuccessState {
    total: number;
}

export interface IHeaderState {
    counter: number;
}

export interface IGalleryState {
    catalog: HTMLElement[];
}

export interface IOrderFormState extends IFormState {
    payment: TPayment | null;
    address: string;
}

export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}