import { IApi, IProductsResponse, IOrderData, IOrderResponse } from '../../types';


export class AppApi {
    constructor(protected api: IApi) {}


    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product');
    }


    postOrder(orderData: IOrderData): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', orderData);
    }
}