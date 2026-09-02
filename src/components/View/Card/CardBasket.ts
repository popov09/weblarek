import { Card, ICardState } from './Card';

interface ICardBasketState extends ICardState {
    index: number;
}

export class CardBasket extends Card<ICardBasketState> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onDelete: () => void) {
        super(container);
        this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
        this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        this.deleteButton.addEventListener('click', this.onDelete);
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }
}