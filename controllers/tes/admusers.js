const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const Invoice = require('../../models/invoiceModel');
const Receipt = require('../../models/receiptModel');

const getUsers = async( req, res = response ) => {

    const users = await User.find().select('-password').lean();

    return res.status(200).json( users );
}

const getUserById = async( req, res = response ) => {
    const { id } = req.params;
    const user = await User.findById(id).lean();
 
    if( !user ) {
        return res.status(404).json({
            message: 'Usuario no encontrado'
        })
    }

    return res.json( user );


}

const updateUserAdm = async(req, res) =>  {
    const { _id = '' } = req.body;
    if ( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del Usuario no es válido' });
    }
    
    try {
        
        const user = await User.findById(_id);
        if ( !user ) {
            return res.status(400).json({ message: 'No existe un Usuario con ese ID' });
        }
        
        ///// verifico pasword
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( req.body.password, user.password );
        
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        ///// verifico pasword
        
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.body.passwordNue !== "") {
        user.password = bcrypt.hashSync(req.body.passwordNue);
        }
        await user.save();

        return res.status(200).json( user );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



const updateUser = async(req, res) =>  {
    
    const { userId = '', role = '' } = req.body;
    
    if ( !isValidObjectId(userId) ) {
        return res.status(400).json({ message: 'No existe usuario por ese id' })
    }

    const validRoles = ['admin','user','super-user','SEO','client'];
    if ( !validRoles.includes(role) ) {
        return res.status(400).json({ message: 'Rol no permitido: ' + validRoles.join(', ') })
    }

    const user = await User.findById( userId );

    if ( !user ) {
        return res.status(404).json({ message: 'Usuario no encontrado: ' + userId });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: 'Usuario actualizado' });
     
}
const updateUserAdministracion = async(req, res) =>  {
    
    const { userId = '', isActive = '' } = req.body;
    
    if ( !isValidObjectId(userId) ) {
        return res.status(400).json({ message: 'No existe usuario por ese id' })
    }

    const user = await User.findById( userId );

    if ( !user ) {
        return res.status(404).json({ message: 'Usuario no encontrado: ' + userId });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({ message: 'Usuario actualizado' });
     
}
const createUser = async(req, res) => {

    try {
        const userInDB = await User.findOne({ name: req.body.name });
        if ( userInDB ) {
            return res.status(400).json({ message: 'Ya existe un Usuario con ese Nombre' });
        }
        delete req.body['_id'];
        req.body.password = bcrypt.hashSync(req.body.password);
        req.body.role = "user";
        const user = new User( req.body );
        await user.save();

        res.status(201).json( user );


    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar logs del servidor' });
     }

}

const deleteUser = async(req, res) =>  {
    const { id = '' } = req.params;
    if ( !isValidObjectId( id ) ) {
        return res.status(400).json({ message: 'El id del Usuario no es válido' });
    }
    
    const invoices = await Invoice.findOne({user: req.params.id });
    if (invoices) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Movimientos con este Usuario' });
      return;
    }

    const receipts = await Receipt.findOne({user: req.params.id })
    if (receipts) {
      res.status(404).send({ message: 'No Puede Borrar por que tiene Recibos con este Usuario' });
      return;
    }

    try {
        
        const user = await User.findById(id);
        if ( !user ) {
            return res.status(400).json({ message: 'No existe un Usuario con ese ID' });
        }
        await user.delete();
        

        return res.status(200).json( user );
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}



module.exports = {
    getUsers,
    getUserById,
    updateUserAdm,
    updateUser,
    updateUserAdministracion,
    createUser,
    deleteUser
}



