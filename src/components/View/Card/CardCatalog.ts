import { Card, ICardState } from './Card';
import { categoryMap } from '../../../utils/constants';

interface ICardCatalogState extends ICardState {
    category: string;
    image: string;
}

export class CardCatalog extends Card<ICardCatalogState> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        this.categoryElement = container.querySelector('.card__category') as HTMLElement;
        this.imageElement = container.querySelector('.card__image') as HTMLImageElement;

        container.addEventListener('click', this.onClick);
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
        const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
        this.categoryElement.className = categoryClass;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
}