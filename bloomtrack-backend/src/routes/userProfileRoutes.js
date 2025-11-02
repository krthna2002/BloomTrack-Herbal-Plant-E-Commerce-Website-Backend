const express = require('express')
const UserProfile = require('../model/userProfile')
const Order = require('../routes/orderRoutes')
const routes = new express()
const cors = require("cors");
const app = express();
app.use(cors());  // Enable CORS
app.use(express.json());

const auth = require('../middleware/auth')
const userAuth = require('../model/userAuth')
const products = require('../model/products')


// ****************************************
// *     USER_PROFILE                     *
// ****************************************

//create userprofile
routes.post("/user/profile", auth, async(req, res)=>{
    try{
        const auth = req.auth
        if(!auth){ throw new Error("Unauthorized.....!")}
        const token = req.token
        req.body.authID = auth._id
        const userProfile = new UserProfile(req.body)
        console.log("dsfds" +userProfile.f_name)
        await userProfile.save()
        await userAuth.updateOne({_id:auth._id},{isProfiled:true})
        res.send({userProfile, token })
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})

//get UserProfile
// routes.get("/user/profile", auth,async(req, res)=>{

//     if(!req.auth.isProfiled){
//         throw new Error('Please complete your profile')
//     } 
//     const user = await UserProfile.findOne({authID:req.auth._id})
//     try{
//         if(!user){
//             throw new Error("User doesn't exists")
//         }
//         res.send(user);
//     }catch(e){
//         const error ={
//             StatusCode:404, message:e.message
//         }
//         res.status(404).send(error)
//     }
// })

//update UserProfile
// routes.patch("/user/profile", auth, async(req, res)=>{
    
//     try{
//         if(!req.auth.isProfiled){
//             throw new Error('Please complete yur profile')
//         }
//         await UserProfile.findOneAndUpdate({authID:req.auth._id}, req.body, {new:false, runValidators:true})
//         const updated = await UserProfile.findOne({authID:req.auth._id})
//         res.send(updated)

//     }catch(e){
//         const error ={
//             StatusCode:404, message:e.message
//         }
//         res.status(400).send(error)
//     }
// })
//***
// update user me profile
routes.get("/user/profile", auth, async (req, res) => {
    try {
        // ✅ First, check if the user has a profile
        const user = await UserProfile.findOne({ authID: req.auth._id });

        if (!user) {
            return res.status(404).json({ StatusCode: 404, message: "User profile does not exist." });
        }

        // ✅ Ensure `isProfiled` flag is handled correctly
        if (!req.auth.isProfiled) {
            return res.status(400).json({ StatusCode: 400, message: "Please complete your profile." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ StatusCode: 500, message: "Internal Server Error" });
    }
});


// ✅ UPDATE USER PROFILE (Avoids Duplicate Key Error)
routes.patch("/user/profile", auth, async (req, res) => {
    try {
        if (!req.auth || !req.auth._id) {
            return res.status(401).json({ message: "Unauthorized access!" });
        }

        // ✅ Find and update user profile
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { authID: req.auth._id },  // Find by unique authID
            { $set: req.body },         // Update fields dynamically
            { new: true, runValidators: true } // ✅ Returns updated doc
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found!" });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});



//delete User Profile
routes.delete("/user/profile", auth, async(req, res)=>{

    if(!req.auth.isProfiled){
        throw new Error("Plz complete Your Profile")
    }
    const user = await UserProfile.findOne(req.auth._id)
    try{
        if(!user){
            throw new Error("User doesn't exist")
        }
        await userAuth.deleteOne({_id:req.auth._id})
        await user.remove()
        res.send("User profile deleted")
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})


// ****************************************
// *     CART_ITEMS                       *
// ****************************************


//Add cart items

routes.patch("/user/cart", auth, async(req, res)=>{
    if(!req.auth.isProfiled){
       throw new Error("Plz complete Your Profile")
    }
    const user = await UserProfile.findOne({authID: req.auth._id})
    try{
        if(!user){
            throw new Error("User Not found")
        }
        let isExist = false
        user.cartItems.forEach(cart =>{
            if(cart.cartItem === req.body.cartItem){
                isExist = true;
            }
        })

        const stockQty = await products.findOne({_id: req.body.cartItem})
        
        if(stockQty !== null && stockQty.qty< req.body.qty){
            throw new Error('Out of stock')
        }else if(stockQty === null){
            throw new Error('Product no longer available')
        }
        if(isExist){
            throw new Error("Product alread present in cart")
        }else{
            await UserProfile.updateOne({_id: user.id},{$push:{cartItems:req.body}})
            res.send(await UserProfile.findById(user.id))
        }
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        
        res.status(400).send(error)
    }
    

})

//remove cart items
routes.delete("/user/cart/:cid",auth, async(req,res)=>{
    if(!req.auth.isProfiled){
        throw new Error("Plz complete Your Profile")
    }
    try{
        await UserProfile.updateOne({authID:req.auth._id},{$pull:{cartItems:{cartItem: req.params.cid}}})
        res.send(await UserProfile.findOne({authID:req.auth._id}))
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})

//icrement or decrement cart itemsl̥
routes.post("/user/cart/:op/:cid", auth, async(req, res)=>{
    const op = req.params.op;
    
    if(!req.auth.isProfiled){ throw new Error("Plz complete Your Profile") }
    try{

        const user = await UserProfile.findOne({authID:req.auth._id})
        const product = await products.findById(req.params.cid)

        if(op === 'add'){

            for(let item of user.cartItems){
                if(item.cartItem === req.params.cid ){
                    if(product.qty>item.qty+1){
                        item.qty = item.qty+1
                        product.qty = item.qty
                        product.status = true
                        break
                    }else{
                        
                        throw new Error("Item out of Stock")
                    }   
                }
            }
            await user.save();
            console.log(product.qty)
            res.send(product)
        }else{
            for(let item of user.cartItems){
                if(item.cartItem === req.params.cid){
                    if(item.qty<=1){ throw new Error("Can't decrease, Minimum limit is needed")}
                    item.qty = item.qty-1
                    product.qty = item.qty
                    break
                }
            }
            await user.save();
            console.log(product.qty)
            res.send(product)
        }
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        console.log(e.message)
        res.status(400).send(error)
    }

})

// ****************************************
// *    WISHLIST_ITEMS                       *
// ****************************************

//Add wishList items
routes.patch("/user/wishlist", auth, async(req, res)=>{

    if(!req.auth.isProfiled){ res.send("Plz complete Your Profile") }
    
    try{
        const user = await UserProfile.findOne({authID: req.auth._id})
        if(!user){
            return res.send("No user Found")
        }
        console.log("entered here")
        let isExist = false
        user.wishListItems.forEach(wish =>{
            if(wish.wishListItem === req.body.wishListItem){
                isExist = true;
            }
        })

        if(isExist){
            throw new Error("Alread added to wishlist");
        }else{
        await UserProfile.findByIdAndUpdate({_id:user._id}, {$push:{wishListItems:{wishListItem: req.body.wishListItem}}})
           
            res.send(await UserProfile.findById({_id:user._id}))
        }
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        console.log(e.message)
        res.status(400).send(error)
    }

})

//remove wishList items
routes.delete("/user/wishlist/:cid", auth, async(req, res)=>{
    if(!req.auth.isProfiled){ throw new Error("Plz complete Your Profile") }
    try{
        await UserProfile.findOneAndUpdate({authID:req.auth._id}, {$pull:{wishListItems:{wishListItem: req.params.cid}}})
        res.send( await UserProfile.findOne({authID:req.auth._id}))
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})

//Move Item for wishlist to cart
routes.post('/user/wishlist',auth, async(req, res)=>{
    if(!req.auth.isProfiled){ throw new Error("Plz complete Your Profile") }
    try{

        let isExist = false
        const user = await UserProfile.findOne({authID: req.auth._id})
        user.cartItems.forEach(cart =>{
            if(cart.cartItem === req.body.wishListItem){
                isExist = true;
                console.log("this is exist")
            }
        })

        if(!isExist){
            await UserProfile.findOneAndUpdate({authID:req.auth._id}, {$push:{cartItems:{cartItem: req.body.wishListItem}}})
        }

        
        await UserProfile.findOneAndUpdate({authID:req.auth._id}, {$pull:{wishListItems:{wishListItem: req.body.wishListItem}}})

        res.send(await UserProfile.findOne({authID:req.auth._id}))
    }catch(e){
        const error ={
            StatusCode:404, message:e.message
        }
        res.status(400).send(error)
    }
})



//Add Address 
routes.patch('/user/address', auth, async(req,res)=>{
    
    try{
        if(!req.auth.isProfiled){ return new Error("Plz complete Your Profile") }
        await UserProfile.updateOne({authID: req.auth._id}, {$push:{addressList: req.body}})
        res.send(await UserProfile.findOne({authID: req.auth._id}))
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }
})

routes.get('/user/address', auth, async(req, res)=>{

    try{
        if(!req.auth.isProfiled){return new Error("Plz Complete Your Profile")}
        const user = await UserProfile.findOne({authID:req.auth._id})
        res.send(user.addressList)

        
    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }

})

//Delete Address
routes.delete('/user/address/:aid', auth, async(req, res)=>{
    
    try{
        if(!req.auth.isProfiled){throw new Error("Plz complete Your profile")}
        await UserProfile.updateOne({authID: req.auth._id},{$pull : {addressList:{_id:req.params.aid}}})
        
        // res.send(await UserProfile.findOne(req.auth._id))
        res.send(await UserProfile.findOne({ authID: req.auth._id }));

    }catch(e){
        const error ={
            statusCode:400,
            message: e.message
        }
        res.send(error).status(400)
    }
})
//buy single products
routes.patch("/user/buy-now", auth, async (req, res) => {
    if (!req.auth.isProfiled) {
        return res.status(400).send({ message: "Please complete your profile" });
    }
try{
        const user = await UserProfile.findOne({ authID: req.auth._id });
    
        if (!user) {
            throw new Error("User not found");
        }

        const product = await products.findOne({ _id: req.body.productId });
        
        if (!product) {
            throw new Error("Product no longer available");
        }

        if (product.qty < req.body.qty) {
            throw new Error("Out of stock");
        }
        // You could create an order object here (or prepare for payment)
        const order = {
            userId: user._id,
            productId: product._id,
            qty: req.body.qty,
            price: product.productPrice,
            status: "pending",
            createdAt: new Date()
        };

        return res.status(200).send({
            message: "Order initiated",
            order
        });
       

    } catch (e) {
        return res.status(400).send({
            message: e.message
        });
    }
});

module.exports = routes
