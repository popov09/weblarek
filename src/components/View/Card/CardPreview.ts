import { Card, ICardState } from './Card';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export interface ICardPreviewState extends ICardState {
    category: string;
    image: string;
    text: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        this.buttonElement.addEventListener('click', this.onClick);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = 'card__category';
        const categoryClass = categoryMap[value as keyof typeof categoryMap];
        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        this.imageElement.src = value;
        this.imageElement.alt = '';
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}