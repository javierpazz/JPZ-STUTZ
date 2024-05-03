const mongoose = require ('mongoose');
const bcrypt = require ( 'bcryptjs');
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetToken: { type: String },
    image: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
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

const db = require('../config/config');

User.findDeliveryMen = async (result) => {


  try {
    const data = await User.find(); 
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
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
          route : "/restaurant/orders/list"
        },
        {
          id : 2,
          name : "REPARTIDOR",
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
          route : "/delivery/orders/list"
        },
        {
          id : 3,
          name : "CLIENTE",
          image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/image_1708694165987?alt=media&token=41d42d49-64f7-4c3e-b10e-eb31797cd84d",
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
    

