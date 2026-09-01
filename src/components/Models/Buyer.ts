import { IBuyer } from '../../types';


export class Buyer {
    private data: IBuyer = {
        payment: 'card',
        email: '',
        phone: '',
        address: ''
    };


    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
    }


    getData(): IBuyer {
        return { ...this.data };
    }


    clear(): void {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }


    validate(): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this.data.email || this.data.email.trim() === '') {
            errors.email = 'Укажите email';
        }

        if (!this.data.phone || this.data.phone.trim() === '') {
            errors.phone = 'Укажите телефон';
        }

        if (!this.data.address || this.data.address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }


    validateField(field: keyof IBuyer): string | null {
        const value = this.data[field];

        if (!value || value.toString().trim() === '') {
            const messages: Record<keyof IBuyer, string> = {
                payment: 'Не выбран способ оплаты',
                email: 'Укажите email',
                phone: 'Укажите телефон',
                address: 'Укажите адрес доставки'
            };
            return messages[field];
        }

        return null;
    }
}