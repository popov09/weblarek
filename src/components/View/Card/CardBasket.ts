import { Card, ICardState } from './Card';
import { ensureElement } from '../../../utils/utils';

export interface ICardBasketState extends ICardState {
    index: number;
}

export class CardBasket extends Card<ICardBasketState> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onDelete: () => void) {
        super(container);
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', this.onDelete);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}