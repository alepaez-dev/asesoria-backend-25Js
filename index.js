require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");

const app = express()

// Middlewares
app.use(express.json());
const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME } = process.env
const url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}`

// Schemas
const koderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10
  },
  age: {
    type: Number,
    min: 18,
    max: 100
  },
  sex: {
    type: String,
    enum: ["f", "m", "o", "p"]
  },
  module: {
    type: String
  },
  generation: {
    type: String
  }
})

// Modelo -> materia prima
const Koder = mongoose.model("Koder", koderSchema, "Koders");
mongoose.connect(url) // esto regresa una promesa
  .then(() => {
    console.log("Estoy conectada a mi base de datos");
    //@ts-ignore
    app.listen(8080, () => {
      console.log("Servidor levantado")
    })
  })
  .catch((err) => {
    console.log("Error", err);
  })

app.get("/", (request, response) => {
  console.log("Endpoint de home");
  response.json("Endpoint de home");
})
/**
 * koders/
 * /koders/idKoders/materias/idMateria
/**
 * path params -> modifican la ruta
 * query params -> solo se reciben de request.query
 */
app.get("/koders", async (req, res) => {
  try {
    const koders = await Koder.find(req.query);
    res.json({
      success: true,
      data: koders
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

app.get("/koders/:id", async (req, res) => {
  console.log("params", req.params);
  try {
    const koder = await Koder.findById(req.params.id);
    res.json({
      success: true,
      data: koder
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    })
  }
})

app.patch("/koders/:id", async (req, res) => {
  console.log("body", req.body)
  try {
    // @ts-ignore
    const updatedKoder = await Koder.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });
    res.status(200).json({
      success: true,
      data: updatedKoder
    })
  } catch (err) {
    res.status(400).json({
      success: false.valueOf,
      message: err.message
    })
  }
})