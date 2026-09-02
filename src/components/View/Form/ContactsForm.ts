import { Form, IFormState } from './Form';
import { IEvents } from '../../base/Events';

export interface IContactsFormState extends IFormState {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}