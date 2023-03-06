const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Empresa = require('../models/empresa');

const getEmpresas = async (req = request, res = response) => {

    const listaEmpresas = await Promise.all([
        Empresa.countDocuments(),
        Empresa.find()
    ]);

    res.json({
        msg: 'Get Empresas',
        listaEmpresas
    });

}

const postEmpresa = async (req = request, res = response) => {

    const {nombre, correo, password, tipo,  rol, sucursales} = req.body;
    const empresaDB = new Empresa({nombre, correo, password, tipo, rol, sucursales});



    const salt = bcryptjs.genSaltSync();
    empresaDB.password = bcryptjs.hashSync(password, salt);

    await empresaDB.save();

    res.status(201).json({
        msg: 'Post Empresas',
        empresaDB
    });
}

const putEmpresa = async (req = request, res = response) => {

    const {id} = req.params;

    const {_id, ...resto} = req.body;

    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    const empresaEditada = await Empresa.findByIdAndUpdate(id, resto, {new: true});

    res.status(200).json({
        msg: 'Empresa Actualizada',
        empresaEditada
    });
}


const deleteEmpresa = async (req = request, res = response) => {
    const {id} = req.params;

    const empresaEliminada = await Empresa.findByIdAndDelete(id);

    res.json({
        msg: 'Empresa elimininada',
        empresaEliminada
    });
}

const getSucursales = async( req = request, res = response) => {
    const empresa = req.empresa._id;
    const sucursales = req.empresa.sucursales

    res.json({
        msg: 'Sucursales',
        sucursales
    })
}

module.exports = {
    getEmpresas,
    postEmpresa,
    putEmpresa,
    deleteEmpresa,
    getSucursales
}