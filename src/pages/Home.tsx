import React, { useState,useEffect } from 'react';

import img1 from '../assets/hello.jpg';
import img2 from '../assets/pexels-math-90946.jpg';
import img3 from '../assets/pexels-pixabay-279906.jpg';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import axios from 'axios';


// Define the type for your product
interface Product {
    _id: number;
    description: string;
    price: number;
   
}

interface CartItem {
    product: Product;
    quantity: number;
}




export const Home = () => {
    const [productData, setproductData] = useState<Product[]>([]);

    

useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getProducts'); // Assuming Express server is running on the same host
      setproductData(response.data)
      console.log(response.data)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    // Function to add a product to the cart
    const addToCart = (product: Product) => {
        setOpen(true)
        const existingItem = cartItems.find(item => item.product._id === product._id);
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([...cartItems, { product, quantity: 1 }]);
        }
    };

    // Function to increase the quantity of a product in the cart
    const increaseQuantity = (productId: number) => {
        setCartItems(cartItems.map(item =>
            item.product._id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    // Function to decrease the quantity of a product in the cart
    const decreaseQuantity = (productId: number) => {
        setCartItems(cartItems.map(item =>
            item.product._id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));
    };

    // Function to remove a product from the cart
    const removeFromCart = (productId: number) => {
      setOpen(false)
      setTimeout(() => {
        
          setCartItems(cartItems.filter(item => item.product._id !== productId));
      }, 100);

    };
    
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    };
   

    return (
        <>
            <div className="product-grid">
                {productData.map((product) => (
                    <div className="product" key={product._id}>
                        <img src={img1} alt={product.description} className='w-32 h-auto' />
                        <h3>{product.description}</h3>
                        <p>${product.price}</p>
                        <button onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        
            <Box sx={{ width: 500 }} role="presentation">

            <Drawer open={open} anchor={'right'} onClose={toggleDrawer(false)}>
            <div className="checkout-cart">
                <h2>Shopping Cart</h2>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.product._id}>
                            <img src={img1} alt={item.product.description} />
                            <div>
                                <p>{item.product.description}</p>
                                <p>${item.product.price}</p>
                                <p>Quantity: {item.quantity}</p>
                                <button onClick={() => increaseQuantity(item.product._id)}>Increase Quantity</button>
                                <button onClick={() => decreaseQuantity(item.product._id)}>Decrease Quantity</button>
                                <button onClick={() => removeFromCart(item.product._id)}>Remove from Cart</button>

                            </div>
                        </li>
                    ))}
                    <p>Total Price {calculateTotalPrice()}</p>
                </ul>
            </div>
      </Drawer>
      </Box>
                    {/* <CheckoutPage cartItems={cartItems} /> */}

        </>
    );
};
