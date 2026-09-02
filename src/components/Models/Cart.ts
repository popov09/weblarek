import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        if (!this.isProductInCart(product.id)) {
            this.items.push(product);
            this.events.emit('basket:changed');
        }
    }

    removeItem(productId: string): void {
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('basket:changed');
    }

    clear(): void {
        this.items = [];
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => {
            return sum + (item.price || 0);
        }, 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    isProductInCart(productId: string): boolean {
        return this.items.some(item => item.id === productId);
    }
}