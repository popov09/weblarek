import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketState {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketState> {
    protected listElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.listElement = container.querySelector('.basket__list') as HTMLElement;
        this.priceElement = container.querySelector('.basket__price') as HTMLElement;
        this.buttonElement = container.querySelector('.basket__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this.buttonElement.disabled = true;
        } else {
            this.listElement.replaceChildren(...items);
            this.buttonElement.disabled = false;
        }
    }

    set total(value: number) {
        this.setText(this.priceElement, `${value} синапсов`);
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}