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
        isAdmin: false,
        isActive: true,
        password: bcrypt.hashSync(password),
        role:'client',
    });
    
    
    try {

        // await newUser.save();
        await newUser.save({validateBeforeSave: true});

        // Generar JWT
        const token = await generarJWT( newUser._id, newUser.name, newUser.email, newUser.isAdmin, newUser.role );

        const {role, name, _id, isAdmin, isActive} = newUser;


        res.status(200).json({
            token,
            user: {_id,
                   email,
                   role,
                   isAdmin,
                   isActive,
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
const crearUsuarioAdministracion = async(req, res = response ) => {
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
        isAdmin: false,
        isActive: true,
        password: bcrypt.hashSync(password),
        role:'client',
    });
    
    
    try {

        // await newUser.save();
        await newUser.save({validateBeforeSave: true});

        // Generar JWT
        const token = await generarJWT( newUser._id, newUser.name, newUser.email, newUser.isAdmin, newUser.role );

        const {role, name, _id, isAdmin, isActive} = newUser;


        res.status(200).json({
            token,
            user: {_id,
                   email,
                   role,
                   isAdmin,
                   isActive,
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
        const token = await generarJWT( usuario._id, usuario.name, usuario.email, usuario.isAdmin, usuario.role );
        
        const {role, name, _id, isAdmin, isActive} = usuario;

        res.json({
            token,
            user: {_id,
                email,
                role,
                isAdmin,
                isActive,
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
const loginUsuarioAdm = async(req, res = response ) => {

    const { email = '', password = '' } = req.body;
    try {
        
        const usuario = await User.findOne({ email });
        // if (user && user.isActive && user.role !== "client") {
        if ( !usuario || usuario.role === "client" ) {
            return res.status(400).json({
                ok: false,
                msg: 'Datos Incorrectos'
            });
        }
        if ( !usuario.isActive ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario Inactivo'
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
        const token = await generarJWT( usuario._id, usuario.name, usuario.email, usuario.isAdmin, usuario.role );
        
        const {role, name, _id, isAdmin, isActive} = usuario;

        res.json({
            token,
            user: {_id,
                email,
                role,
                isAdmin,
                isActive,
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
    
    const usuario = await User.findOne({ email });

    // const token = await generarJWT( uid, email );
    const token = await generarJWT( usuario._id, usuario.name, usuario.email, usuario.isAdmin, usuario.role );

    if ( !usuario ) {
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no existe con ese email'
        });
    }

    const {role, name, _id, isAdmin, isActive} = usuario;

        res.json({
            token,
            user: {_id,
                email,
                role,
                isAdmin,
                isActive,
                name
             }
     })

}






module.exports = {
    crearUsuario,
    crearUsuarioAdministracion,
    loginUsuario,
    loginUsuarioAdm,
    revalidarToken
}