import { Api } from '../base/Api';
import { IProductsResponse, IOrderData, IOrderResponse } from '../../types';


export class AppApi extends Api {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    getProducts(): Promise<IProductsResponse> {
        return this.get('/product') as Promise<IProductsResponse>;
    }


    postOrder(orderData: IOrderData): Promise<IOrderResponse> {
        return this.post('/order/', orderData) as Promise<IOrderResponse>;
    }
}