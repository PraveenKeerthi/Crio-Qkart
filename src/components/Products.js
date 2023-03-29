import { SettingsEthernet } from "@mui/icons-material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Typography } from "@mui/material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart from "./Cart"
import { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
import "./Products.css";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  let localStoredItem=localStorage.getItem("username");
  // let localStoredToken=localStorage.getItem("token");
  let [loggedIn,setLoggedIn]=useState(localStoredItem==null?false:true);
  const [prodData,setProdData]=useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [loadingData,setLoadingData]=useState(false);
  const [addLoadedData,setAddLoadedData]=useState(false);
  const [searchNotFound,setSeachNotFound]=useState(false);
  const [cartItem,setCartItem]=useState([]);
  const [constProdArr,setConstProdArr]=useState([])


  // LoadsForFirstTime
  
  useEffect(()=>{
    setLoadingData(true)
    performAPICall();
  },[])

  useEffect(()=>{
    fetchCart(localStorage.getItem('token'))
  },[constProdArr])

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data    

      const prom=await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
      const data=prom.data;
      setCartItem(generateCartItemsFrom(data,prodData));
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {

    let flag = false;
    
    items.forEach((prod)=>{
      if(prod._id===productId){
        flag = true;
      }
  })
  return flag;
  };

  const addToCart =async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    // if(options.preventDuplicate){
    //   postItemToServer({'productId':productId,'qty':qty})
    // }
    if(token){
      if(isItemInCart(items,productId) && options.preventDuplicate===false){
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
      }else{
        postItemToServer({productId,qty})
      }
    }else{
      enqueueSnackbar("Login to add an item to the cart",{variant:"warning"})
    }
  };

  async function postItemToServer(Item){
    const prom=await axios.post(`${config.endpoint}/cart`, Item,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    })
    const data=prom.data; 
    setCartItem(generateCartItemsFrom(data,prodData));
  }
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   * 
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  


  const performAPICall = async () => {
    try{
      const prom=await axios.get(`${config.endpoint}/products`)
      const data=prom.data;
      setProdData(data)
     
      setConstProdArr(data);
      setLoadingData(false)
      setAddLoadedData(true)
    }catch(e){
      enqueueSnackbar(e.response.data.message,{variant:'error'})
    }
    
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try{
      const prom=await axios.get(`${config.endpoint}/products/search?value=${text}`)
      const data=prom.data;
      setProdData(data);
      setSeachNotFound(false);
    }catch{
      setSeachNotFound(true);
    }
    
  };

  // TODO: CRIO_TSK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    setTimeout(()=>{
      performSearch(event.target.value)
    },debounceTimeout)
  };



  return (
    <div>
      <Header data={localStoredItem}>
      {<TextField
        className="search-desktop search"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>debounceSearch(e,500)}
      />}
      </Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e)=>debounceSearch(e,500)}
      />
      <Grid container>
        <Grid item md={loggedIn?9:12} >
          <Grid container>
          <Grid item className="product-grid" >
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          </Grid>
        {
          searchNotFound
          &&
          <div className="loading">
            <SentimentDissatisfied></SentimentDissatisfied>
            <Typography>No products found</Typography>
          </div>
        }
        {
          loadingData 
          && 
          <div className="loading">
            <CircularProgress color='success'></CircularProgress>  
            <Typography>Loading Products...</Typography>
          </div>
        }
       {
        addLoadedData 
        &&
        !(searchNotFound)
        &&
          <Grid container spacing={2}>
          {
            prodData.map((prod)=>{
              return (
              <Grid item xs={6} md={3} key={prod._id}>
                <ProductCard product={prod} handleAddToCart={()=>addToCart(localStorage.getItem('token'),cartItem,prodData,prod._id,1)}></ProductCard>
              </Grid>
              );
            })
          }
          </Grid>     
        }
        </Grid>
       
        {
          loggedIn
          &&
          <Grid item md={3} className="bg-color-cart">
              <Cart products={prodData} items={cartItem} handleQuantity={addToCart}></Cart>
          </Grid>
        }
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
