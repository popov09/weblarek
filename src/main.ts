import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { AppApi } from './components/API/AppApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';

import { EventEmitter } from './components/base/Events';
import { Modal } from './components/View/Modal';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Basket } from './components/View/Basket';
import { Success } from './components/View/Success';
import { CardCatalog } from './components/View/Card/CardCatalog';
import { CardPreview } from './components/View/Card/CardPreview';
import { CardBasket } from './components/View/Card/CardBasket';
import { OrderForm } from './components/View/Form/OrderForm';
import { ContactsForm } from './components/View/Form/ContactsForm';

import { IProduct, IOrderData } from './types';

const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const apiInstance = new Api(API_URL);
const api = new AppApi(apiInstance);

const page = document.querySelector('.page') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;
const orderFormContainer = document.querySelector('#order') as HTMLFormElement;
const contactsFormContainer = document.querySelector('#contacts') as HTMLFormElement;

const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketContainer = basketTemplate.content.cloneNode(true) as DocumentFragment;
const basketElement = basketContainer.firstElementChild as HTMLElement;

const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const basket = new Basket(basketElement, events);
const orderForm = new OrderForm(orderFormContainer, events);
const contactsForm = new ContactsForm(contactsFormContainer, events);

function createCardElement(template: string): HTMLElement {
    const templateElement = document.querySelector(`#${template}`) as HTMLTemplateElement;
    if (!templateElement) {
        console.error(`Template ${template} not found`);
        return document.createElement('div');
    }
    const clone = templateElement.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild;
    if (!element) {
        console.error(`Template ${template} has no child elements`);
        return document.createElement('div');
    }
    return element as HTMLElement;
}

api.getProducts()
    .then(response => {
        productsModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

events.on('items:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const card = new CardCatalog(
            createCardElement('card-catalog'),
            () => {
                productsModel.setSelectedProduct(item);
            }
        );
        card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            category: item.category,
            image: CDN_URL + item.image
        });
        return card.container;
    });
    gallery.catalog = cards;
});

events.on('preview:changed', (product: IProduct) => {
    const inBasket = cartModel.isProductInCart(product.id);

    const card = new CardPreview(
        createCardElement('card-preview'),
        () => {
            if (cartModel.isProductInCart(product.id)) {
                cartModel.removeItem(product.id);
                modal.close();
            } else {
                cartModel.addItem(product);
                modal.close();
            }
        }
    );
    card.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image,
        text: product.description,
        inBasket: inBasket
    });
    modal.content = card.container;
    modal.open();
});

events.on('basket:changed', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getItemCount();

    header.counter = count;

    const cards = items.map((item, index) => {
        const card = new CardBasket(
            createCardElement('card-basket'),
            () => {
                cartModel.removeItem(item.id);
            }
        );
        card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
        return card.container;
    });
    basket.items = cards;
    basket.total = total;
});

events.on('basket:open', () => {
    modal.content = basket.container;
    modal.open();
});

events.on('order:open', () => {
    buyerModel.clear();
    orderForm.clear();
    orderForm.payment = null;
    modal.content = orderForm.container;
    modal.open();
});

events.on('order.payment:change', (data: { type: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.type });
    orderForm.payment = data.type;
    validateOrderForm();
});

events.on('order.address:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ address: data.value });
    validateOrderForm();
});

function validateOrderForm() {
    const errors = buyerModel.validate();
    const data = buyerModel.getData();
    const valid = data.payment !== null && data.address.trim() !== '' && Object.keys(errors).length === 0;

    orderForm.valid = valid;
    orderForm.errors = Object.values(errors);
}

events.on('order:submit', () => {
    const errors = buyerModel.validate();
    const data = buyerModel.getData();
    const valid = data.payment !== null && data.address.trim() !== '' && Object.keys(errors).length === 0;

    if (valid) {
        modal.content = contactsForm.container;
        validateContactsForm();
    }
});

events.on('contacts.email:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ email: data.value });
    validateContactsForm();
});

events.on('contacts.phone:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ phone: data.value });
    validateContactsForm();
});

function validateContactsForm() {
    const errors = buyerModel.validate();
    const data = buyerModel.getData();
    const valid = data.email.trim() !== '' && data.phone.trim() !== '' && Object.keys(errors).length === 0;

    contactsForm.valid = valid;
    contactsForm.errors = Object.values(errors);
}

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const cartItems = cartModel.getItems();
    const total = cartModel.getTotalPrice();

    const errors = buyerModel.validate();
    const valid = buyerData.email.trim() !== '' && buyerData.phone.trim() !== '' && Object.keys(errors).length === 0;

    if (valid && cartItems.length > 0 && buyerData.payment) {
        const orderData: IOrderData = {
            payment: buyerData.payment,
            email: buyerData.email,
            phone: buyerData.phone,
            address: buyerData.address,
            items: cartItems.map(item => item.id),
            total: total
        };

        api.postOrder(orderData)
            .then(response => {
                cartModel.clear();
                buyerModel.clear();

                const success = new Success(
                    createCardElement('success'),
                    () => {
                        modal.close();
                    }
                );
                success.total = response.total;
                modal.content = success.container;
                modal.open();
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
            });
    }
});

events.on('modal:close', () => {
    page.classList.remove('page__modal-open');
});

events.on('modal:open', () => {
    page.classList.add('page__modal-open');
});