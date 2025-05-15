const mongoose = require ('mongoose');
const bcrypt = require ( 'bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    image: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: true, required: true },
    role : {
      type: String,
      enum: {
          values: ['admin','user','super-user','SEO','client'],
          message: '{VALUE} no es un role válido',
          default: 'client',
          required: true
        }
        },
    roles: [{
      id : { type: Number, required: true },
      name    : { type: String, required: true },
      image   : { type: String },
      route   : { type: String, required: true },
  }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

// const db = require('../config/config');

User.findDeliveryMen = async (result) => {


  try {
    const data = await User.find({isAdmin : false }); 
    console.log('Repartidores:', data);
    result(null, data);
  } catch (error) {
    let err = '';
    err = error;
    console.log('Error:', err);
    result(err, null);
  }



  // const userR = await User.find((err, res) => {
  //   if (err) {
  //       console.log('Error:', err);
  //       result(err, null);
  //   }
  //   else {
  //       console.log('Usuario obtenido:', res);
  //       result(null, res);
  //   }
  // }
  // );
  }
  
  
  User.findByEmail = async (email, result) => {
      
    try {
      const userR = await User.findOne({ email });
        console.log('Usuario obtenido:', userR);
        result(null, userR);
      
    } catch (error) {
      let err = '';
      err = error;
      console.log('Error:', err);
      result(err, null);
      
    }
    };

  
  
  
    
    User.create = async (user, result) => {
        
      // const hash = await bcrypt.hash(user.password, 8);
    
      // console.log('estoy');
      // console.log(user);
    
      const newUser = new User({
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        password: bcrypt.hashSync(user.password, 8),
        resetToken: user.resetToken,
        isAdmin: user.isAdmin,
        roles: [{
          id : 1,
          name : "ADMIN",
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
          route : "/restaurant/orders/list"
        },
        {
          id : 2,
          name : "REPARTIDOR",
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/delivery.png?alt=media&token=ceb780de-a6fa-4466-a227-1c984bced734",
          route : "/delivery/orders/list"
        },
      {
          id : 3,
          name : "CLIENTE",
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user.png?alt=media&token=7af6485c-405f-4952-8875-f010f182ee8e",
          route : "/client/products/list"
        }
      ],
        });
        let userRe = await newUser.save(
        (err, res) => {
                if (err) {
                    console.log('Error:', err);
                    result(err, null);
                }
                else {
                    console.log('Id del nuevo usuario:', res._id.toString());
                    result(null, res._id.toString());
                }
            }
        );
    
    
    
        }
    
        module.exports = User;
    

