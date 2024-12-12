const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../models/userModel');
const { generarJWT } = require('../../tes/helpers/jwt');
const { isValidEmail } = require('../../utils/validations');
 
const crearUsuario = async(req, res = response ) => {
    const { name = '', email = '', password = '' } = req.body;
    
    
    if ( !isValidEmail( email ) ) {
        return res.status(400).json({
            message: 'El correo no tiene formato de correo'
        });
    }
    
    let usuario = await User.findOne({ email });

    if ( usuario ) {
        return res.status(400).json({
            ok: false,
            msg: 'No puede usar ese correo'
        });
    }
    
    // TODO: VALIDAR EMAIL
        
    newUser = new User({
        name: req.body.name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role:'client',
    });
    
    
    try {

        // await newUser.save();
        await newUser.save({validateBeforeSave: true});

        // Generar JWT
        const token = await generarJWT( newUser.id, newUser.email );

        const {role, name} = newUser;


        res.status(200).json({
            token,
            user: {email,
                   role,
                   name
                }
        })

        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


const loginUsuario = async(req, res = response ) => {

    const { email = '', password = '' } = req.body;
    try {
        
        const usuario = await User.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.email );

        const {role, name, _id} = usuario;

        res.json({
            token,
            user: {_id,
                email,
                role,
                name
             }
     })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}





const revalidarToken = async (req, res = response ) => {

    const { uid, email } = req;

    // Generar JWT
    const token = await generarJWT( uid, email );

    const usuario = await User.findOne({ email });

    if ( !usuario ) {
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no existe con ese email'
        });
    }

    const {role, name, _id} = usuario;

        res.json({
            token,
            user: {_id,
                email,
                role,
                name
             }
     })

}






module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}