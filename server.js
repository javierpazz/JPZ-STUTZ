const http = require ('http');
const { Server } = require ('socket.io');
const express = require ('express');
const cors = require('cors');
const multer = require('multer');
const path = require ('path');
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');
const seedRouter = require ('./routes/seedRoutes.js');
const productRouter = require ('./routes/productRoutes.js');
const encargadoRouter = require ('./routes/encargadoRoutes.js');
const supplierRouter = require ('./routes/supplierRoutes.js');
const comprobanteRouter = require ('./routes/comprobanteRoutes.js');
const customerRouter = require ('./routes/customerRoutes.js');
const stateOrdRouter = require ('./routes/stateOrdRoutes.js');
const valueeRouter = require ('./routes/valueeRoutes.js');
const configurationRouter = require ('./routes/configurationRoutes.js');
const userRouter = require ('./routes/userRoutes.js');
const orderRouter = require ('./routes/orderRoutes.js');
const uploadRouter = require ('./routes/uploadRoutes.js');
const invoiceRouter = require ('./routes/invoiceRoutes.js');
const receiptRouter = require ('./routes/receiptRoutes.js');

const ordersSocket = require('./sockets/ordersSocket');
/*
* IMPORTAR RUTAS
*/
const usersRoutesMob = require('./routes/mob/userRoutes.js');
const categoriesRoutesMob = require('./routes/mob/categoryRoutes.js');
const productRoutesMob = require('./routes/mob/productRoutes.js');
const addressRoutesMob = require('./routes/mob/addressRoutes.js');
const orderRoutesMob = require('./routes/mob/orderRoutes.js');
// const mercadoPago


dotenv.config();
console.log("jpz");
console.log(process.env.MONGODB_URI);
console.log(`"${process.env.MONGODB_URI}"`);

mongoose
  .connect(process.env.MONGODB_URI)
  // .connect(`"${process.env.MONGODB_URI}"`)
  // .connect("mongodb+srv://admin:admin123456@stutzapp.nf44trs.mongodb.net/sdb")
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();


// Configure Header HTTP - CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
app.get('/api/keys/google', (req, res) => {
  res.send({ key: process.env.GOOGLE_API_KEY || '' });
});


const upload = multer({
  storage: multer.memoryStorage()
});


// Rutas
app.use('/api/tes/user', require('./routes/tes/auth') );
app.use('/api/tes/admin', require('./routes/tes/admadmin') );
app.use('/api/tes/admin/users', require('./routes/tes/admusers') );
app.use('/api/tes/admin/products', require('./routes/tes/admproducts') );
app.use('/api/tes/admin/productsesc', require('./routes/tes/admproductsesc') );
app.use('/api/tes/admin/productsfac', require('./routes/tes/admproductsfac') );
app.use('/api/tes/admin/instrumentos', require('./routes/tes/adminstrumentos') );
app.use('/api/tes/admin/customers', require('./routes/tes/admcustomers') );
app.use('/api/tes/admin/proveedores', require('./routes/tes/admproveedores') );
app.use('/api/tes/admin/valores', require('./routes/tes/admvalores') );
app.use('/api/tes/admin/encargados', require('./routes/tes/admencargados') );
app.use('/api/tes/admin/configuraciones', require('./routes/tes/admconfiguraciones') );
app.use('/api/tes/admin/estadosorden', require('./routes/tes/admestadosorden') );
app.use('/api/tes/admin/comprobantes', require('./routes/tes/admcomprobantes') );
app.use('/api/tes/admin/partes', require('./routes/tes/admpartes') );
app.use('/api/tes/admin/upload', uploadRouter);
// app.use('/api/admin/upload', require('./tes/routes/admproductsupload') );
app.use('/api/tes/admin/orders', require('./routes/tes/admorders') );
app.use('/api/tes/seed', require('./routes/tes/seed') );
//ooo app.use('/api/search', require('./tes/routes/searchPro') );
//ooo app.use('/api/productbyslug', require('./tes/routes/productbyslug') );
//ooo app.use('/api/productbysear', require('./tes/routes/productbysear') );
//ooo app.use('/api/product', require('./tes/routes/product') );
app.use('/api/tes/products', require('./routes/tes/products') );
app.use('/api/tes/orders', require('./routes/tes/orders') );
//ooo app.use('/api/orderbyid', require('./tes/routes/orderbyid') );
//ooo app.use('/api/ordersbyus', require('./tes/routes/ordersbyus') );



/*
* LLAMADO DE LAS RUTAS
*/
usersRoutesMob(app, upload);
categoriesRoutesMob(app ,upload);
addressRoutesMob(app);
productRoutesMob(app ,upload);
orderRoutesMob(app);
// mercadoPagoRoutes(app);



app.use('/api/upload', uploadRouter);
app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/encargados', encargadoRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/comprobantes', comprobanteRouter);
app.use('/api/customers', customerRouter);
app.use('/api/stateOrds', stateOrdRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/receipts', receiptRouter);
app.use('/api/valuees', valueeRouter);
app.use('/api/configurations', configurationRouter);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// );

app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})


app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 3000;

const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
ordersSocket(io);

const users = [];

io.on("connection", (socket) => {
  socket.on("onLogin", (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };

    const existUser = users.find((x) => x.name === updatedUser.name);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    const admin = users.find((x) => x.name === "Admin" && x.online);
    if (admin) {
      io.to(admin.socketId).emit("updateUser", updatedUser);
    }
    if (updatedUser.name === "Admin") {
      io.to(updatedUser.socketId).emit("listUsers", users);
    }
  });

  socket.on("disconnect", () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      const admin = users.find((x) => x.name === "Admin" && x.online);
      if (admin) {
        io.to(admin.socketId).emit("updateUser", user);
      }
    }
  });
  socket.on("onUserSelected", (user) => {
    const admin = users.find((x) => x.name === "Admin" && x.online);
    if (admin) {
      const existUser = users.find((x) => x.name === user.name);
      io.to(admin.socketId).emit("selectUser", existUser);
    }
  });
  socket.on("onMessage", (message) => {
    if (message.from === "Admin") {
      const user = users.find((x) => x.name === message.to && x.online);
      if (user) {
        io.to(user.socketId).emit("message", message);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit("message", {
          from: "System",
          to: "Admin",
          body: "User Is Not Online",
        });
      }
    } else {
      const admin = users.find((x) => x.name === "Admin" && x.online);
      if (admin) {
        io.to(admin.socketId).emit("message", message);
        const user = users.find((x) => x.name === message.from && x.online);
        if (user) {
          user.messages.push(message);
        }
      } else {
        io.to(socket.id).emit("message", {
          from: "System",
          to: message.from,
          body: "Sorry. Admin is not online right now",
        });
      }
    }
  });
});


httpServer.listen(port, '0.0.0.0', () => {
  // console.log(`Serve at http://localhost:${port}`);
  console.log(`Serve at http://0.0.0.0:${port}`);
});


// app.listen(port, () => {
//   console.log(`serve at http://localhost:${port}`);
// });
