const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = {estado: true}

  // * Con await para que espere la resolución de ambas promesas, Promise.all ejecuta ambas de manera simultanea, y no continua hasta que ambas funcionen, y si una da error, todas dan error
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
  ])

  res.json({total, usuarios});
};

const usuariosPut = async (req = request, res) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...rest } = req.body;

  // Validar contra BD
  if (password) {
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // * Numero de vueltas para hacer complicada la desincriptacion, defecto es 10
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, rest)

  res.status(200).json({ msg: "put API - controlador", usuario });
};

const usuariosPost = async (req = request, res) => {

  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync(); // * Numero de vueltas para hacer complicada la desincriptacion, defecto es 10
  usuario.password = bcryptjs.hashSync(password, salt);

  // Guardar en BD
  // ! Si intento grabar unos datos que no corresponden a lo definido en el modelo usuario, la bd me lanzara error, y no grabara la entidad.
  usuario.save();

  res.status(200).json({ usuario });
};

const usuariosDelete = async (req = request, res) => {
  const { id } = req.params;

  // Fisicamente lo borramos
  // ! const usuario = await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
  
  res.json(usuario);
};

const usuariosPatch = (req = request, res) => {
  res.json({ msg: "patch API - controlador" });
};

module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
};
