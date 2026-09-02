import { Component } from '../base/Component';
import { IEvents } from '../base/Events';


export class Modal extends Component<HTMLElement> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;

        // Закрытие по крестику
        this.closeButton.addEventListener('click', this.close.bind(this));

        // Закрытие по клику вне модального окна
        this.container.addEventListener('click', this.close.bind(this));

        // Остановка всплытия клика внутри контента
        this.contentElement.addEventListener('click', (e) => e.stopPropagation());
    }


    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }


    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }


    close() {
        this.container.classList.remove('modal_active');
        this.content = null as any;
        this.events.emit('modal:close');
    }


    render(data: HTMLElement): HTMLElement {
        this.content = data;
        this.open();
        return this.container;
    }
}