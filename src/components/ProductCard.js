import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia image={product.image} component='img' />
      <CardContent>
      <Typography variant="h5" mb={1}>
       {product.name}
      </Typography>
      <Typography variant="h5" mb={1} sx={{fontWeight: 'bold'}}>
        ${product.cost}
      </Typography>
      <Rating value={product.rating} readOnly></Rating>
      </CardContent>
      <CardActions className='card-actions'>
        <Button className='card-button' variant='contained' size="medium" fullWidth> <AddShoppingCartOutlined/> ADD TO CART</Button>
      </CardActions>
      
    </Card>
  );
};

export default ProductCard;
