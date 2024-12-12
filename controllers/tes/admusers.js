const { response } = require('express');
const { isValidObjectId } = require('mongoose');
const User = require('../../models/userModel');

const getUsers = async( req, res = response ) => {

    const users = await User.find().select('-password').lean();

    return res.status(200).json( users );
}

const updateUser = async(req, res) =>  {
    
    const { userId = '', role = '' } = req.body;
    
    if ( !isValidObjectId(userId) ) {
        return res.status(400).json({ message: 'No existe usuario por ese id' })
    }

    const validRoles = ['admin','super-user','SEO','client'];
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



module.exports = {
    getUsers,
    updateUser
}



