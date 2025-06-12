const mongoose = require ('mongoose');

const instrumentoSchema = new mongoose.Schema(
  {

    codIns: { type: String, required: true },
    name: { type: String, required: true },
    orderItems: [
      {
        slug: { type: String },
        title: { type: String, required: true },
        medPro: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        size : { type: String },
        porIva : { type: Number, required: true },
        venDat : { type: String },
        observ : { type: String },
        terminado : { type: Boolean },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],


  },
  {
    timestamps: true,
  }
);


// instrumentoSchema.index({ codigoPro: 1, id_config: 1 }, { unique: true });
const Instrumento = mongoose.model('Instrumento', instrumentoSchema);

// const db = require('../config/config');

Instrumento.findByCategory = async (id_categoryR, result) => {

  try {
    const data = await Instrumento.find({id_category : id_categoryR }); 
    result(null, data);
  } catch (error) {
    let err = '';
    err = error;
    console.log('Error:', err);
    result(err, null);
  }
  };
 
 
 Instrumento.create = async (instrumento, result) => {
 
     const newInstrumento = new Instrumento({
         codIns: instrumento.codIns,
         name: instrumento.name,
 
         });
         let instrumentoRe = await newinstrumento.save(
         (err, res) => {
             if (err) {
                 console.log('Error:', err);
                 result(err, null);
             }
             else {
                 console.log('Id de la nuevo instrumentoo:', res._id.toString());
                 result(null, res._id.toString());
             }
         }
 
     )
 
 }
 
 
 Instrumento.updateS = async (instrumento, result) => {
 
 
   const instrumentoR = await Instrumento.findById(instrumento._id); 
   if (instrumentoR) {
         instrumentoR.codIns = instrumento.codIns,
         instrumentoR.name = instrumento.name

       try {
        let instrumentoRe = await instrumentoR.save;
        result(null, instrumentoRe._id);
      } catch (error) {
        let err = '';
        err = error;
        console.log('Error:', err);
        result(err, null);
      }
      };
    }


 
 Instrumento.delete = async (id, result) => {
   const instrumento = await Instrumento.findById(id); 
   if (instrumento) {
     await instrumento.remove(
 
         (err, res) => {
             if (err) {
                 console.log('Error:', err);
                 result(err, null);
             }
             else {
                 console.log('Id del instrumentoo actualizado:', instrumento._id);
                 result(null, instrumento._id);
             }
         }
     );
   } else {
       console.log('problema con find');
   }
 }
 
 
 
 // instrumento.delete = (id, result) => {
 //     const sql = `
 //     DELETE FROM
 //         instrumentos
 //     WHERE
 //         id = ?
 //     `;
 
 //     db.query(
 //         sql,
 //         [id],
 //         (err, res) => {
 //             if (err) {
 //                 console.log('Error:', err);
 //                 result(err, null);
 //             }
 //             else {
 //                 console.log('Id del instrumentoo eliminado:', id);
 //                 result(null, id);
 //             }
 //         }
 //     )
 // }
 
 module.exports = Instrumento;