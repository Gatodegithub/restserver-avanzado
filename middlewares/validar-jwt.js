const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token)
    return res.status(401).json({ msg: "No hay token en la petición" });

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // * Puede que devuelva undefined si el usuario fue borrado de la bd.
    const usuario = await Usuario.findById(uid);

    if(!usuario) {
      return res.status(401).json({
        msg: "usuario no existe en BD"
      })
    }

    // * Verificar si el uid tiene estado en true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no válido - usuario con estado: false"
      })
    }

    // * Agregar en la req al usuario que esta autenticado.
    req.usuario = usuario;

    next(); 
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Token no valido",
    })
  }
};

module.exports = {
  validarJWT,
};
