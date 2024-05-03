const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    neighborhood: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    id_user: { type: String },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model('Address', addressSchema);

// const db = require('../config/config');

Address.findByUser = async (id_userR, result) => {

    try {
      const data = await Address.find({id_user : id_userR });
      console.log('Addresses:', data);
      result(null, data);
    } catch (error) {
      let err = '';
      err = error;
      console.log('Error:', err);
      result(err, null);
    }
    };
  


Address.create = async (address, result) => {

        const newAddress = new Address({
            address: address.address,
            neighborhood: address.neighborhood,
            lat: address.lat,
            lng: address.lng,
            id_user: address.id_user,
            });
            let addressRe = await newAddress.save(
                (err, res) => {
                    if (err) {
                        console.log('Error:', err);
                        result(err, null);
                    }
                    else {
                        console.log('Id de la nueva direccion:', res._id);
                        result(null, res._id);
                    }
                }
            )
    }
    

module.exports = Address;