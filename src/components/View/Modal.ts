import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<HTMLElement> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.close.bind(this));
        }
        this.container.addEventListener('click', (evt: MouseEvent) => {
            if (evt.target === this.container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement | null) {
        if (this.contentElement) {
            if (value === null) {
                this.contentElement.replaceChildren();
            } else {
                this.contentElement.replaceChildren(value);
            }
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
    }
}