import { Form, IFormState } from './Form';
import { IEvents } from '../../base/Events';
import { ensureElement } from '../../../utils/utils';

export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}