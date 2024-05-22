const db = require('../Models/Database');
const ObjectId = require('mongodb').ObjectId;

const collection = "companies";

const getData = async (req, res, next) => {
  const result = await db.getDb().db().collection(collection).find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists); 
  });
};
const getDataById =  async (req, res, next) => {
  try {
    const id =  new ObjectId(req.params.id);
    const result = await db.getDb().db().collection(collection).findOne({ _id: id });
    res.setHeader('Content-Type', 'application/json');
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: collection+' not found' });
    }
  }
  catch (error) {
    next(error);
  }
}
//create function for  router.post(professionalController.createData);
const createData = async (req, res, next) => {
  try {
    const data = {
      "name": req.body.name,
      "addressId": req.body.addressId,
      "phone": req.body.phone,
      "emailAddress": req.body.emailAddress,
      "membershipLevel": req.body.membershipLevel,
      "joinedOn": req.body.joinedOn
    }
    const result = await db.getDb().db().collection(collection).insertOne(data);
    if(result.acknowledged){
      res.status(200).json({ message: collection+' inserted successfully' });
    } else {
      res.status(404).json({ message: collection+'not inserted' });
    }
  }
  catch (error) {
    next(error);
  }
}
// create function for router.put('/:id', professionalController.updateData);
const updateData = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const data = {
        "name": req.body.name,
        "addressId": req.body.addressId,
        "phone": req.body.phone,
        "emailAddress": req.body.emailAddress,
        "membershipLevel": req.body.membershipLevel,
        "joinedOn": req.body.joinedOn
      }
    const result = await db.getDb().db().collection(collection).replaceOne(
      { _id: id },
      data
    );
    if(result.modifiedCount > 0){
      res.status(200).json({ message: collection+' updated successfully' });
    } else {
      res.status(404).json({ message: collection+' not found' });
    }
  }
  catch (error) {
    next(error);
  }
}

//create function for  router.delete('/:id', professionalController.deleteData);
const deleteData = async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await db.getDb().db().collection(collection).deleteOne({ _id: id });
  if(result.deletedCount > 0){
      res.status(200).json({ message: collection+' deleted successfully' });
    } else {
      res.status(404).json({ message: collection+' not found' });
    }
  }
  catch(error){
    next(error);
  }
}
module.exports = { getData,  getDataById, updateData, createData, deleteData };