import { Cart } from "../model/cart.model";

import { ICartData } from "../Schema/cart.schema"
import apiError from "../utils/apiErrors";


const addCartService = async(data:ICartData )=>{
     try {
      //fist check if the product exist ...
      //if exist increse the quntiy and the total price
      //and not create a new doc thats it ..

        const {isDeleted,products,status,userId,totalQunatity,totalPrice} =data;

        
   const existingCart  = await Cart.findById({userId, status: 'active'});

  if(existingCart){
        const existingProduct = await existingCart.products.find((item)=> item.productId.toString() === products.p)                                                                                                                                                                
  }else{

  }

       const totalPriceCalculated = products.reduce((acc, item) => acc + item.quantity * item.price, 0);
      console.log("datass",data)
      console.log("--totaslprice",totalPriceCalculated)
       const cart = await Cart.create({
        userId: userId,
        products: products,
        totalPrice: totalPriceCalculated,
        status: status,
        isDeleted: isDeleted,
       })
     console.log("--",cart)
       return cart;
     } catch (error) {
         throw new apiError(401,"Faild to add into cart")
     }
}
const getCartService = async()=>{
    try {
        const cartDatas = await Cart.find({status: "active"}).select("userId products totalPrice status isDeleted");
        console.log('cart----',cartDatas);
        return cartDatas;
    } catch (error) {
         throw new apiError(401,"faild to fetch the cart")
    }
}
export {addCartService, getCartService}