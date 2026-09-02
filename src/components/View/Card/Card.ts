import { Component } from '../../base/Component';

export interface ICardState {
    id: string;
    title: string;
    price: number | null;
    category?: string;
    image?: string;
    text?: string;
    index?: number;
}

export class Card<T extends ICardState = ICardState> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = container.querySelector('.card__title') as HTMLElement;
        this.priceElement = container.querySelector('.card__price') as HTMLElement;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}