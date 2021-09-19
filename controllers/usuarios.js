const { request, response } = require("express");

const usuariosGet = (req = request, res = response) => {

  const { msg, nombre = "No name", limit } = req.query;

  res.json({ msg: "get API - controlador", msg, nombre, limit });
};

const usuariosPut = (req = request, res) => {

  const { id } = req.params;

  res.status(200).json({ msg: "put API - controlador", id });
};

const usuariosPost = (req = request, res) => {
  const { nombre, edad } = req.body;

  res.status(200).json({ msg: "post API - controlador", nombre, edad });
};

const usuariosDelete = (req = request, res) => {
  res.json({ msg: "delete API - controlador" });
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
