// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


//cart
let cart = [];
// buttons
let buttonsDOM = [];

//getting products from local storage
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map((elementOfArray) => {
                const { title, price } = elementOfArray.fields;
                const id = elementOfArray.sys.id;
                const image = elementOfArray.fields.image.fields.file.url;
                return { title, price, id, image };
            })
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}

//display products

class UI {

    displayproducts(products) {
        let result = '';
        products.forEach((element) => {
            result += ` 
        <article class="product">
            <div class="img-container">
                <img src=${element.image} alt="products" class="product-img">
                <button class="bag-btn" data-id=${element.id}>
                    <i class="fas fa-shopping-cart"></i>
                    add to bag
                </button>
            </div>
            <h3>${element.title}</h3>
            <h4> &#8377; ${element.price}</h4>
        </article>
        `;
        });

        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = document.querySelectorAll('.bag-btn')
        Array.from(buttons);
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => {
                return item.id === id;
            });
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }

            button.addEventListener('click', (event) => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products 
                let cartItem = { ...Storage.getProduct(id), amount: 1 };

                // add product to the cart
                cart = [...cart, cartItem];

                // save cart in local storage
                Storage.saveCart(cart);
                // set cart value
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();

            })


        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(cartItem){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML =`<img src=${cartItem.image} alt="">
        <div>
            <h4>${cartItem.title}</h4>
            <h5> &#8377; ${cartItem.price}</h5>
            <span class="remove-item" data-id= ${cartItem.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id= ${cartItem.id}></i>
            <p class="item-amount">${cartItem.amount}</p>
            <i class="fas fa-chevron-down" data-id= ${cartItem.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    };
}

//local storage
class Storage {
    static saveProducts(selectedProduct) {
        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct))
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('selectedProduct'))

        return products.find(product => product.id === id);
    }

    static saveCart(productInCart) {
        localStorage.setItem('productInCart', JSON.stringify(productInCart))
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then((products) => {

        ui.displayproducts(products);
        Storage.saveProducts(products);

    }).then(() => {
        ui.getBagButtons();
    });
})