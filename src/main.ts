import './scss/styles.scss';

import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { AppApi } from './components/API/AppApi';
import { Api } from './components/base/Api';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

const apiInstance = new Api(API_URL);
const api = new AppApi(apiInstance);

console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ===\n');


console.log('--- 1. Тестирование Products ---');

productsModel.setItems(apiProducts.items);
console.log('✓ Товары сохранены в каталоге');
console.log('✓ Количество товаров в каталоге:', productsModel.getItems().length);

console.log('✓ Весь каталог:', productsModel.getItems());

if (apiProducts.items.length > 0) {
    const firstProduct = apiProducts.items[0];
    const found = productsModel.getProductById(firstProduct.id);
    console.log(`✓ Товар с id "${firstProduct.id}":`, found);
}

if (apiProducts.items.length > 0) {
    productsModel.setSelectedProduct(apiProducts.items[0]);
    console.log('✓ Выбранный товар:', productsModel.getSelectedProduct());
}

console.log('\n--- 2. Тестирование Cart ---');

if (apiProducts.items.length >= 2) {
    cartModel.addItem(apiProducts.items[0]);
    cartModel.addItem(apiProducts.items[1]);
    console.log('✓ Добавлено 2 товара в корзину');
}

console.log('✓ Товары в корзине после добавления:', cartModel.getItems());
console.log('✓ Количество товаров в корзине:', cartModel.getItemCount());
console.log('✓ Общая стоимость:', cartModel.getTotalPrice());

if (apiProducts.items.length > 0) {
    const isInCart = cartModel.isProductInCart(apiProducts.items[0].id);
    console.log(`✓ Товар "${apiProducts.items[0].title}" в корзине:`, isInCart);
}

cartModel.removeItem(apiProducts.items[0].id);
console.log('✓ Товар удален из корзины');

console.log('✓ Товары в корзине после удаления:', cartModel.getItems());
console.log('✓ Количество товаров в корзине после удаления:', cartModel.getItemCount());

cartModel.clear();
console.log('✓ Корзина очищена');
console.log('✓ Товары в корзине после очистки:', cartModel.getItems());
console.log('✓ Количество товаров в корзине после очистки:', cartModel.getItemCount());

console.log('\n--- 3. Тестирование Buyer ---');

console.log('--- 3.1 Проверка валидации пустых данных ---');
const emptyErrors = buyerModel.validate();
console.log('✓ Ошибки при пустых данных:', emptyErrors);

console.log('\n--- 3.2 Получение ошибки по конкретному полю из объекта ---');
console.log('✓ Ошибка для поля payment:', emptyErrors.payment || 'Нет ошибки');
console.log('✓ Ошибка для поля email:', emptyErrors.email || 'Нет ошибки');
console.log('✓ Ошибка для поля phone:', emptyErrors.phone || 'Нет ошибки');
console.log('✓ Ошибка для поля address:', emptyErrors.address || 'Нет ошибки');

console.log('\n--- 3.3 Установка корректных данных ---');
buyerModel.setData({
    payment: 'card',
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'Москва, ул. Тестовая, д. 1'
});
console.log('✓ Данные покупателя сохранены');
console.log('✓ Данные покупателя:', buyerModel.getData());

console.log('\n--- 3.4 Валидация после установки данных ---');
const errors = buyerModel.validate();
console.log('✓ Ошибки валидации (должны быть пустыми):', errors);

console.log('\n--- 3.5 Проверка валидации с пустым email ---');
buyerModel.setData({ email: '' });
const emailErrors = buyerModel.validate();
console.log('✓ Ошибки валидации после установки пустого email:', emailErrors);
console.log('✓ Ошибка для поля email:', emailErrors.email);

console.log('\n--- 3.6 Проверка валидации с пустым payment ---');
buyerModel.setData({ payment: null });
const paymentErrors = buyerModel.validate();
console.log('✓ Ошибки валидации после установки пустого payment:', paymentErrors);
console.log('✓ Ошибка для поля payment:', paymentErrors.payment);

console.log('\n--- 3.7 Очистка данных ---');
buyerModel.clear();
console.log('✓ Данные покупателя очищены');
console.log('✓ Результат очистки (getData):', buyerModel.getData());
console.log('✓ После очистки payment =', buyerModel.getData().payment);
console.log('✓ После очистки email =', buyerModel.getData().email);
console.log('✓ После очистки phone =', buyerModel.getData().phone);
console.log('✓ После очистки address =', buyerModel.getData().address);

console.log('\n=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ЗАВЕРШЕНО ===\n');



console.log('=== ЗАПРОС К СЕРВЕРУ ===');

api.getProducts()
    .then(response => {
        console.log('✓ Ответ от сервера получен');
        console.log('✓ Ответ сервера:', response);

        productsModel.setItems(response.items);
        console.log('✓ Товары сохранены в модель');

        console.log('✓ Весь каталог после сохранения:', productsModel.getItems());
        console.log('✓ Количество товаров в каталоге:', productsModel.getItems().length);
        console.log('✓ Первый товар из каталога:', productsModel.getItems()[0]);
    })
    .catch(error => {
        console.error('✗ Ошибка при запросе к серверу:', error);
    });