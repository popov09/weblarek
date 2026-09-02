import { Component } from '../../base/Component';
import { IEvents } from '../../base/Events';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T extends IFormState = IFormState> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
        this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

        container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.events.emit(`${container.name}.${field}:change`, { field, value });
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        if (this.submitButton) {
            this.submitButton.disabled = !value;
        }
    }

    set errors(value: string[]) {
        if (this.errorsElement) {
            this.errorsElement.textContent = value.join('; ');
        }
    }
}