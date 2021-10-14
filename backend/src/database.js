const { MongoClient } = require('mongodb');
const express = require("express")
require('dotenv').config();

const database = module.exports;
const uri =`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.fgk07.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`

database.connect = async function connect() {
  database.client = await MongoClient.connect(uri, { useUnifiedTopology: true });
};
