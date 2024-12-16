const bcrypt = require ('bcryptjs');

const data = {
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
      name: 'Basir',
      lastname: 'Basir',
      email: 'admin@example.com',
      phone: '1',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: true,
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
      name: 'John',
      lastname: 'John',
      email: 'user@example.com',
      phone: '2',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: false,
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
    {
      name: 'Oo',
      lastname: 'Oo',
      email: 'Oo@oo.com',
      phone: '3',
      password: bcrypt.hashSync('123456'),
      image : "https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/user_menu.png?alt=media&token=73763014-45af-465d-9831-7ef660ca5bb1",
      isAdmin: false,
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

  products: [
    {
      // _id: '1',
      title: 'Malbec',
      slug: 'Malbec',
      category: 'Tinto',
      image: '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg', // 679px × 829px
      images: [
        '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg',
        '/products/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_37cbb451da834d20ac6a5c3a3eab24a7.jpg?alt=media&token=4f21d3c6-bbba-408f-b4bb-63fad0282ec7',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 9800,
      inStock: 100,
      brand: 'Stutz',
      rating: 4.5,
      numReviews: 700,
      description: 'Vino Malbec Organico del Valle de Cafayate - Salta - Argentina',
    },
    {
      // _id: '1',
      title: 'Cabernet',
      slug: 'Cabernet',
      category: 'Tinto',
      image: '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg', // 679px × 829px
      images: [
        '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
        '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0cda786daa25d10fde5dd4d7af369ebf.jpg?alt=media&token=3ce32eb6-e982-407c-ba48-ae3804e7ff3a',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 10200,
      inStock: 100,
      brand: 'Stutz',
      rating: 5,
      numReviews: 105,
      description: 'Vino Cabernet Organico del Valle de Cafayate - Salta - Argentina',
    },
    {
      // _id: '1',
      title: 'Tannat',
      slug: 'Tannat',
      category: 'Tinto',
      image: '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg', // 679px × 829px
      images: [
        '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
        '/products/img_0cda786daa25d10fde5dd4d7af369ebf.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_5b3c26aba0774671aab572bcadde3bd0.jpg?alt=media&token=3a258879-a1b4-4cb2-9c3d-b77196747c99',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 10200,
      inStock: 100,
      brand: 'Stutz',
      rating: 5,
      numReviews: 1140,
      description: 'Vino Tannat Organico del Valle de Cafayate - Salta - Argentina',
    },
    {
      // _id: '1',
      title: 'Torrontes',
      slug: 'Torrontes',
      category: 'Blanco',
      image: '/products/img_0700be14742225ca421f2db276f77bab.jpg', // 679px × 829px
      images: [
        '/products/img_0700be14742225ca421f2db276f77bab.jpg',
        '/products/img_0700be14742225ca421f2db276f77bab.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 9500,
      inStock: 100,
      brand: 'Stutz',
      rating: 4,
      numReviews: 458,
      description: 'Vino Torrontes Organico del Valle de Cafayate - Salta - Argentina',
    },
    {
      // _id: '1',
      title: 'Torrontes Tardio',
      slug: 'Torrontes-Tardio',
      category: 'Blanco',
      image: '/products/img_0700be14742225ca421f2db276f77bab.jpg', // 679px × 829px
      images: [
        '/products/img_0700be14742225ca421f2db276f77bab.jpg',
        '/products/img_0700be14742225ca421f2db276f77bab.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_0700be14742225ca421f2db276f77bab.jpg?alt=media&token=4fecd43b-62de-4f10-9d2b-21e149804df6',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 9500,
      inStock: 750,
      brand: 'Stutz',
      rating: 4,
      numReviews: 345,
      description: 'Vino Torrontes Tardio Organico del Valle de Cafayate - Salta - Argentina',
    },
    {
      // _id: '1',
      title: 'Garnacha',
      slug: 'Garnacha',
      category: 'Tinto',
      image: '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg', // 679px × 829px
      images: [
        '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
        '/products/img_8055978bfc4ac981a51189c1ab67283a.jpg',
    ],
      image1: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
      image2: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
      image3: 'https://firebasestorage.googleapis.com/v0/b/delivery-udemy-mysql-b2eff.appspot.com/o/img_8055978bfc4ac981a51189c1ab67283a.jpg?alt=media&token=8380bc0b-6689-4e1a-9c64-8c5b468aad0a',
      id_category: "6630f13dd6d68d5c088be2cd",
      price: 12000,
      inStock: 100,
      brand: 'Stutz',
      rating: 5,
      numReviews: 40,
      description: 'Vino Garnacha Organico del Valle de Cafayate - Salta - Argentina',
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
