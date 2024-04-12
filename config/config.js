// const mongoose = require('mongoose');


// const dbConnection = async() => {
//     try {
        
//         // await mongoose.connect( 'mongodb://127.0.0.1:27017/amazona', {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true, 
//             useUnifiedTopology: true,
//             useCreateIndex: true
//         });

//         console.log('DB Online');


//     } catch (error) {
//         console.log(error);
//         throw new Error('Error a la hora de inicializar BD');
//     }

// }
// dbConnection()


// module.exports = {
//     dbConnection
// }
