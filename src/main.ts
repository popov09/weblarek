import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { AppApi } from './components/API/AppApi';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

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

import { IOrderData } from './types';

const events = new EventEmitter();

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const apiInstance = new Api(API_URL);
const api = new AppApi(apiInstance);

const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header');
const modalContainer = ensureElement<HTMLElement>('.modal');

const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);

const cardPreview = new CardPreview(
    cloneTemplate<HTMLElement>('#card-preview'),
    () => {
        events.emit('card-preview:button-click');
    }
);

const successComponent = new Success(
    cloneTemplate<HTMLElement>('#success'),
    () => {
        events.emit('success:close');
    }
);

api.getProducts()
    .then(response => {
        productsModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

events.on('card-preview:button-click', () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;
    if (cartModel.isProductInCart(product.id)) {
        cartModel.removeItem(product.id);
    } else {
        cartModel.addItem(product);
    }
    modal.close();
});

events.on('success:close', () => {
    modal.close();
});

events.on('items:changed', () => {
    const items = productsModel.getItems();
    const cards = items.map(item => {
        const card = new CardCatalog(
            cloneTemplate<HTMLElement>('#card-catalog'),
            () => {
                events.emit('card-catalog:click', { productId: item.id });
            }
        );
        card.render({
            title: item.title,
            price: item.price,
            category: item.category,
            image: CDN_URL + item.image
        });
        return card.render();
    });
    gallery.catalog = cards;
});

events.on('card-catalog:click', (data: { productId: string }) => {
    const product = productsModel.getProductById(data.productId);
    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

events.on('preview:changed', () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;

    const inBasket = cartModel.isProductInCart(product.id);

    let buttonText: string;
    let buttonDisabled: boolean;

    if (product.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (inBasket) {
        buttonText = 'Удалить из корзины';
        buttonDisabled = false;
    } else {
        buttonText = 'Купить';
        buttonDisabled = false;
    }

    cardPreview.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: CDN_URL + product.image,
        text: product.description,
        buttonText: buttonText,
        buttonDisabled: buttonDisabled
    });
    modal.content = cardPreview.render();
    modal.open();
});

events.on('basket:changed', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotalPrice();
    const count = cartModel.getItemCount();

    header.counter = count;

    const cards = items.map((item, index) => {
        const card = new CardBasket(
            cloneTemplate<HTMLElement>('#card-basket'),
            () => {
                events.emit('card-basket:delete', { productId: item.id });
            }
        );
        card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
        return card.render();
    });

    basket.items = cards;
    basket.total = total;
    basket.buttonDisabled = items.length === 0;
});

events.on('card-basket:delete', (data: { productId: string }) => {
    cartModel.removeItem(data.productId);
});

events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

events.on('order:open', () => {
    modal.content = orderForm.render();
    modal.open();
});

events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.address = buyerData.address;
    orderForm.payment = buyerData.payment;

    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    orderForm.valid = orderErrors.length === 0;
    orderForm.errors = orderErrors;

    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;

    const contactsErrors: string[] = [];
    if (errors.email) contactsErrors.push(errors.email);
    if (errors.phone) contactsErrors.push(errors.phone);
    contactsForm.valid = contactsErrors.length === 0;
    contactsForm.errors = contactsErrors;
});

events.on('order.payment:change', (data: { type: 'card' | 'cash' }) => {
    buyerModel.setData({ payment: data.type });
});

events.on('order.address:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ address: data.value });
});

events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

events.on('contacts.email:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ email: data.value });
});

events.on('contacts.phone:change', (data: { field: string, value: string }) => {
    buyerModel.setData({ phone: data.value });
});

events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const cartItems = cartModel.getItems();
    const total = cartModel.getTotalPrice();

    const orderData: IOrderData = {
        payment: buyerData.payment as 'card' | 'cash',
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
            successComponent.total = response.total;
            modal.content = successComponent.render();
            modal.open();
        })
        .catch(error => {
            console.error('Ошибка при оформлении заказа:', error);
        });
});