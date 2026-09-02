import { Card, ICardState } from './Card';
import { categoryMap } from '../../../utils/constants';
import { ensureElement } from '../../../utils/utils';

export interface ICardCatalogState extends ICardState {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

        container.addEventListener('click', this.onClick);
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
}