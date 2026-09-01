import './scss/styles.scss';

// Импорты моделей и API
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { AppApi } from './components/API/AppApi';

import { apiProducts } from './utils/data';

// Конфигурация API
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'https://larek-api.nomoreparties.co';

const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();
const api = new AppApi(API_ORIGIN);


console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ===\n');

console.log('--- 1. Тестирование Products ---');

productsModel.setItems(apiProducts.items);
console.log('✓ Товары сохранены в каталоге');
console.log('✓ Количество товаров в каталоге:', productsModel.getItems().length);

if (apiProducts.items.length > 0) {
    const firstProduct = apiProducts.items[0];
    const found = productsModel.getProductById(firstProduct.id);
    console.log(`✓ Товар с id "${firstProduct.id}":`, found?.title);
}

if (apiProducts.items.length > 0) {
    productsModel.setSelectedProduct(apiProducts.items[0]);
    console.log('✓ Выбранный товар:', productsModel.getSelectedProduct()?.title);
}

console.log('\n--- 2. Тестирование Cart ---');

if (apiProducts.items.length >= 2) {
    cartModel.addItem(apiProducts.items[0]);
    cartModel.addItem(apiProducts.items[1]);
    console.log('✓ Добавлено 2 товара в корзину');
}

console.log('✓ Товаров в корзине:', cartModel.getItemCount());
console.log('✓ Общая стоимость:', cartModel.getTotalPrice());

if (apiProducts.items.length > 0) {
    const isInCart = cartModel.isProductInCart(apiProducts.items[0].id);
    console.log(`✓ Товар "${apiProducts.items[0].title}" в корзине:`, isInCart);
}

cartModel.removeItem(apiProducts.items[0].id);
console.log('✓ Товаров в корзине после удаления:', cartModel.getItemCount());

cartModel.clear();
console.log('✓ Корзина очищена, товаров:', cartModel.getItemCount());

console.log('\n--- 3. Тестирование Buyer ---');

buyerModel.setData({
    payment: 'card',
    email: 'test@example.com',
    phone: '+79991234567',
    address: 'Москва, ул. Тестовая, д. 1'
});
console.log('✓ Данные покупателя сохранены');
console.log('✓ Данные:', buyerModel.getData());

const errors = buyerModel.validate();
console.log('✓ Ошибки валидации:', errors);

const emailError = buyerModel.validateField('email');
console.log('✓ Ошибка для поля email:', emailError || 'Нет ошибки');

buyerModel.clear();
console.log('✓ Данные покупателя очищены');

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');

// === РАБОТА С СЕРВЕРОМ ===

console.log('\n=== ЗАПРОС К СЕРВЕРУ ===');

api.getProducts()
    .then(response => {
        console.log('✓ Ответ от сервера получен');
        console.log('✓ Количество товаров на сервере:', response.items.length);

        productsModel.setItems(response.items);
        console.log('✓ Товары сохранены в модель');
        console.log('✓ Каталог обновлен, товаров:', productsModel.getItems().length);
        console.log('✓ Первый товар из каталога:', productsModel.getItems()[0]?.title);
    })
    .catch(error => {
        console.error('✗ Ошибка при запросе к серверу:', error.message);
    });