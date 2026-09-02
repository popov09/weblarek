import { Card, ICardState } from './Card';
import { categoryMap } from '../../../utils/constants';

interface ICardPreviewState extends ICardState {
    category: string;
    image: string;
    text: string;
    inBasket: boolean;
}

export class CardPreview extends Card<ICardPreviewState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;
        this.textElement = container.querySelector('.card__text') as HTMLElement;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

        this.buttonElement.addEventListener('click', this.onClick);
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.className = categoryClass;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set text(value: string) {
        this.setText(this.textElement, value);
    }

    set inBasket(value: boolean) {
        if (this.price === null) {
            this.buttonElement.disabled = true;
            this.setText(this.buttonElement, 'Недоступно');
        } else if (value) {
            this.setText(this.buttonElement, 'Удалить из корзины');
        } else {
            this.setText(this.buttonElement, 'Купить');
        }
    }
}