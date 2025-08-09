const bcrypt = require ('bcryptjs');


const data = {

  valuee: [
    {
    codVal: '1',
    desVal: 'EFECTIVO',
    },
    {
    codVal: '2',
    desVal: 'CHEQUE',
    },
    {
    codVal: '3',
    desVal: 'TARJETA',
    },
    ],

  supplier: [
        {
        codSup: '1',
        name: 'PROOVEDOR 1',
        email: 'proovedor1@email.com',
        domcomer: 'direccion Prov 1',
        cuit: '20303030303',
        coniva: 'RESP INSC',
      },
        {
        codSup: '2',
        name: 'PROOVEDOR 2',
        email: 'proovedor2@email.com',
        domcomer: 'direccion Prov 2',
        cuit: '30303030303',
        coniva: 'RESP INSC',
        },
    ],
  encargado: [
        {
        codEnc: '1',
        name: 'ENCARGADO 1',
        email: 'encargado1@email.com',
      },
      {
        codEnc: '2',
        name: 'ENCARGADO 2',
        email: 'encargado2@email.com',
        },
    ],

  customer: [
      {
        codCus: '1',
        nameCus: 'CLIENTE 1',
        emailCus: 'cliente1@email.com',
        domcomer: 'DIRECCION CLIENTE 1 ',
        cuit: '20-20202020-2',
        coniva: 'RESP INSCRIPTO',
        },
        {
          codCus: '2',
          nameCus: 'CLIENTE 2',
          emailCus: 'cliente2@email.com',
          domcomer: 'DIRECCION CLIENTE 2',
          cuit: '20-20202020-2',
          coniva: 'RESP INSCRIPTO',
          },
    ],

  instrumento: [
      {
        codIns: '1',
        name: 'ESCRITURA',
        },
        {
          codIns: '2',
          name: 'BOLETO',
          },
    ],


  configuration: [
      {
        codCon: '0001',
        name: 'STUTZ WINES',
        domcomer: 'DIRECCION STUTZ WINES',
        cuit: '20-20202020-2',
        coniva: 'RESP. INSCRIPTO',
        ib: '87654321',
        feciniact: '12/07/2021',
        numIntRem: 0,
        numIntRec: 0,
        numIntCaj: 0,
        numIntMov: 0,
      },
      {
        codCon: '0002',
        name: 'FILTROS NORTE',
        domcomer: 'DIRECCION FILTROS NORTE',
        cuit: '20-20202020-2',
        coniva: 'RESP. INSCRIPTO',
        ib: '87654321',
        feciniact: '12/07/2021',
        numIntRem: 0,
        numIntRec: 0,
        numIntCaj: 0,
        numIntMov: 0,
      },
      ],
      

  categories: [
    {
      name: 'Tintos',
      description: 'Tintos',
      image : 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
      },
      {
        name: 'Blancos',
        description: 'Blancos',
        image : 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
        },
      ],
   users: [
    {
      name: 'Javier',
      lastname: 'Javier',
      email: 'admin@example.com',
      phone: '1',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: true,
      isActive: true,
      role: "admin",
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
    },
    {
      name: 'Juan',
      lastname: 'Juan',
      email: 'user@example.com',
      phone: '2',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: false,
      isActive: true,
      role: "user",
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
      },
    {
      name: 'Oo',
      lastname: 'Oo',
      email: 'Oo@oo.com',
      phone: '3',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: false,
      isActive: true,
      role: "client",
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
  },
  ],

};
//   products: [
//     {
//       // _id: '1',
//       name: 'Nike Slim shirt',
//       slug: 'nike-slim-shirt',
//       category: 'Shirts',
//       image: '/images/p1.jpg', // 679px × 829px
//       price: 120,
//       inStock: 10,
//       brand: 'Nike',
//       rating: 4.5,
//       numReviews: 10,
//       description: 'high quality shirt',
//     },
//     {
//       // _id: '2',
//       name: 'Adidas Fit Shirt',
//       slug: 'adidas-fit-shirt',
//       category: 'Shirts',
//       image: '/images/p2.jpg',
//       price: 250,
//       inStock: 0,
//       brand: 'Adidas',
//       rating: 4.0,
//       numReviews: 10,
//       description: 'high quality product',
//     },
//     {
//       // _id: '3',
//       name: 'Nike Slim Pant',
//       slug: 'nike-slim-pant',
//       category: 'Pants',
//       image: '/images/p3.jpg',
//       price: 25,
//       inStock: 15,
//       brand: 'Nike',
//       rating: 4.5,
//       numReviews: 14,
//       description: 'high quality product',
//     },
//     {
//       // _id: '4',
//       name: 'Adidas Fit Pant',
//       slug: 'adidas-fit-pant',
//       category: 'Pants',
//       image: '/images/p4.jpg',
//       price: 65,
//       inStock: 5,
//       brand: 'Puma',
//       rating: 4.5,
//       numReviews: 10,
//       description: 'high quality product',
//     },
//   ],
// };
module.exports = data;
