import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // setup state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    }
    catch (error) {
      setError("error retrieving products: " + error);
    }
  }
  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCart(response.data);
    }
    catch (error) {
      setError("error retrieving cart: " + error);
    }
  }

  const addCart = async (product) => {
    try {
      await axios.post("/api/cart/" + product.id, product);
    }
    catch (error) {
      setError("error adding a product" + error);
    }
  }
  const removeCart = async (item) => {
    try {
      await axios.delete("/api/cart/" + item.id);
    }
    catch (error) {
      setError("error deleting a product" + error);
    }
  }
  const removeQ = async (item) => {
    try {
      await axios.post("/api/cart/" + item.id + "/" + (parseInt(item.quantity) - 1));
    }
    catch (error) {
      setError("error removing quantity" + error);
    }
  }
  const addQ = async (item) => {
    try {
      await axios.post("/api/cart/" + item.id + "/" + (parseInt(item.quantity) + 1));
    }
    catch (error) {
      setError("error adding quantity" + error);
    }
  }

  // fetch ticket data
  useEffect(() => {
    fetchProducts();
  }, []);

  const AddToCart = async (product) => {
    await addCart(product);
    fetchCart();
  }
  const RemoveFromCart = async (item) => {
    await removeCart(item);
    fetchCart();
  }
  const AddToQuantity = async (item) => {
    await addQ(item);
    fetchCart();
  }
  const RemoveFromQuantity = async (item) => {
    await removeQ(item);
    fetchCart();
  }
  

  // render results
  return (
    <div className="App">
      {error}
      <h1>Cart</h1>
      {cart.map( item => (
        <div key={item.id} className="item">
            {item.name}, Quantity: {item.quantity}
            <button onClick={e => RemoveFromQuantity(item)}>-</button>
            <button onClick={e => AddToQuantity(item)}>+</button>
            <button onClick={e => RemoveFromCart(item)}>Remove from Cart</button>
        </div>
      ))} 
      <h1>Products</h1>
      {products.map( product => (
        <div key={product.id} className="ticket">
            {product.name}, {product.price}
          <button onClick={e => AddToCart(product)}>Add to Cart</button>
        </div>
      ))}     
    </div>
  );
}

export default App;
