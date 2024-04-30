import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.send("Mi primer API");
});

app.get("/equipos", (req, res) => {
  const data = readData();
  res.json(data.equipos);
});

app.get("/equipos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const equipo = data.equipos.find((equipo) => equipo.id === id);
  res.json(equipo);
});

app.post("/equipos", (req, res) => {
  const data = readData();
  const body = req.body;
  const newEquipo = {
    id: data.equipos.length + 1,
    ...body,
  };
  data.equipos.push(newEquipo);
  writeData(data);
  res.json(newEquipo);
});

app.put("/equipos/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const equipoIndex = data.equipos.findIndex((equipo) => equipo.id === id);
  data.equipos[equipoIndex] = {
    ...data.equipos[equipoIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Se actualizaron los datos correctamente" });
});

app.delete("/equipos/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const equipoIndex = data.equipos.findIndex((equipo) => equipo.id === id);
  data.equipos.splice(equipoIndex, 1);
  writeData(data);
  res.json({ message: "Se elimino correctamente" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
