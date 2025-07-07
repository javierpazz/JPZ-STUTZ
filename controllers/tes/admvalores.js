const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const Valor = require('../../models/valueeModel');
const Receipt = require('../../models/receiptModel');

const getValores = async( req, res = response ) => {

    const valors = await Valor.find()
        .sort({ title: 'asc' })
        .lean();

    return res.status(200).json( valors );
}

const getValoresBySlug = async( req, res = response ) => {
    const { desVal } = req.params;
    const valor = await Valor.findOne({ desVal }).lean();
 
    if( !valor ) {
        return res.status(404).json({
            message: 'Valor no encontrado'
        })
    }

    return res.json( valor );


}
const getValoresById = async( req, res = response ) => {
    const { id } = req.params;
    const valor = await Valor.findById(id).lean();
 
    if( !valor ) {
        return res.status(404).json({
            message: 'Valor no encontrado'
        })
    }

    return res.json( valor );


}


const updateValor = async(req, res) =>  {

    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Valor no es válido' });
    }
    


    try {
        
        const valor = await Valor.findById(_id);
        if ( !valor ) {
            return res.status(400).json({ message: 'No existe un Valor con ese ID' });
        }
        valor.codVal = req.body.codVal;
        valor.desVal = req.body.desVal;
        await valor.save();

        return res.status(200).json( valor );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

const createValor = async(req, res) => {

    try {

        const valorInDB = await Valor.findOne({ desVal: req.body.desVal });
        if ( valorInDB ) {
            return res.status(400).json({ message: 'Ya existe un Valor con ese Nombre' });
        }
        delete req.body['_id'];
        const valor = new Valor( req.body );
        await valor.save();

        res.status(201).json( valor );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteValor = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Valor no es válido' });
    }
    

    const receipts = await Receipt.findOne({"receiptItems._id": req.params.id})
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Valor' });
      return;
    }




    try {
        
        const valor = await Valor.findById(id);
        if ( !valor ) {
            return res.status(400).json({ message: 'No existe un Valor con ese ID' });
        }
        await valor.delete();
        

        return res.status(200).json( valor );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getValores,
    getValoresBySlug,
    getValoresById,
    updateValor,
    createValor,
    deleteValor
}



