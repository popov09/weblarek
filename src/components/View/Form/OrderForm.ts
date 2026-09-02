import { Form, IFormState } from './Form';
import { IEvents } from '../../base/Events';
import { TPayment } from '../../../types';

export interface IOrderFormState extends IFormState {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormState> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
        this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
        this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        if (this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit('order.payment:change', { type: 'card' });
            });
        }

        if (this.cashButton) {
            this.cashButton.addEventListener('click', () => {
                this.events.emit('order.payment:change', { type: 'cash' });
            });
        }
    }

    set payment(value: TPayment | null) {
        if (this.cardButton) {
            this.cardButton.classList.toggle('button_alt-active', value === 'card');
        }
        if (this.cashButton) {
            this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        }
    }

    set address(value: string) {
        if (this.addressInput) {
            this.addressInput.value = value;
        }
    }
}