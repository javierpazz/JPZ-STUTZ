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
const supplierRouter = require ('./routes/supplierRoutes.js');
const stateOrdRouter = require ('./routes/stateOrdRoutes.js');
const valueeRouter = require ('./routes/valueeRoutes.js');
const configurationRouter = require ('./routes/configurationRoutes.js');
const userRouter = require ('./routes/userRoutes.js');
const orderRouter = require ('./routes/orderRoutes.js');
const uploadRouter = require ('./routes/uploadRoutes.js');
const invoiceRouter = require ('./routes/invoiceRoutes.js');
const receiptRouter = require ('./routes/receiptRoutes.js');


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

mongoose
  // .connect(process.env.MONGODB_URI)
  .connect(`${process.env.MONGODB_URI}`)
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


/*
* LLAMADO DE LAS RUTAS
*/
usersRoutesMob(app, upload);
categoriesRoutesMob(app ,upload);
// addressRoutes(app);
productRoutesMob(app ,upload);
orderRoutesMob(app);
// mercadoPagoRoutes(app);



app.use('/api/adm/upload', uploadRouter);
app.use('/api/adm/seed', seedRouter);
app.use('/api/adm/products', productRouter);
app.use('/api/adm/suppliers', supplierRouter);
app.use('/api/adm/stateOrds', stateOrdRouter);
app.use('/api/adm/users', userRouter);
app.use('/api/adm/orders', orderRouter);
app.use('/api/adm/invoices', invoiceRouter);
app.use('/api/adm/receipts', receiptRouter);
app.use('/api/adm/valuees', valueeRouter);
app.use('/api/adm/configurations', configurationRouter);

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// );

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const users = [];

// io.on("connection", (socket) => {
//   socket.on("onLogin", (user) => {
//     const updatedUser = {
//       ...user,
//       online: true,
//       socketId: socket.id,
//       messages: [],
//     };

//     const existUser = users.find((x) => x.name === updatedUser.name);
//     if (existUser) {
//       existUser.socketId = socket.id;
//       existUser.online = true;
//     } else {
//       users.push(updatedUser);
//     }
//     const admin = users.find((x) => x.name === "Admin" && x.online);
//     if (admin) {
//       io.to(admin.socketId).emit("updateUser", updatedUser);
//     }
//     if (updatedUser.name === "Admin") {
//       io.to(updatedUser.socketId).emit("listUsers", users);
//     }
//   });

//   socket.on("disconnect", () => {
//     const user = users.find((x) => x.socketId === socket.id);
//     if (user) {
//       user.online = false;
//       const admin = users.find((x) => x.name === "Admin" && x.online);
//       if (admin) {
//         io.to(admin.socketId).emit("updateUser", user);
//       }
//     }
//   });
//   socket.on("onUserSelected", (user) => {
//     const admin = users.find((x) => x.name === "Admin" && x.online);
//     if (admin) {
//       const existUser = users.find((x) => x.name === user.name);
//       io.to(admin.socketId).emit("selectUser", existUser);
//     }
//   });
//   socket.on("onMessage", (message) => {
//     if (message.from === "Admin") {
//       const user = users.find((x) => x.name === message.to && x.online);
//       if (user) {
//         io.to(user.socketId).emit("message", message);
//         user.messages.push(message);
//       } else {
//         io.to(socket.id).emit("message", {
//           from: "System",
//           to: "Admin",
//           body: "User Is Not Online",
//         });
//       }
//     } else {
//       const admin = users.find((x) => x.name === "Admin" && x.online);
//       if (admin) {
//         io.to(admin.socketId).emit("message", message);
//         const user = users.find((x) => x.name === message.from && x.online);
//         if (user) {
//           user.messages.push(message);
//         }
//       } else {
//         io.to(socket.id).emit("message", {
//           from: "System",
//           to: message.from,
//           body: "Sorry. Admin is not online right now",
//         });
//       }
//     }
//   });
// });


// httpServer.listen(port, () => {
//   console.log(`Serve at http://localhost:${port}`);
// });


app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
