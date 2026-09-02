import { Component } from '../base/Component';

interface ISuccessState {
    total: number;
}

export class Success extends Component<ISuccessState> {
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onClick: () => void) {
        super(container);
        this.descriptionElement = container.querySelector('.order-success__description') as HTMLElement;
        this.closeButton = container.querySelector('.order-success__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', this.onClick);
    }

    set total(value: number) {
        this.setText(this.descriptionElement, `Списано ${value} синапсов`);
    }

    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}