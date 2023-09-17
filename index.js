const express = require("express");
const fs =  require("fs"); //fs = Fail System
const app = express();
const PORT = 3000;

app.use(express.json()); //Lee el payload del front end y lo transforma en JSON (lo de la linea 19)

app.listen(PORT, console.log('Server UP'));

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/canciones",(req, res) => { //es /canciones ya que eso se indica en el front end en la ruta que consulta
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8" ));
    res.json(canciones);
});

app.post("/canciones", (req, res)=>{
    const nuevaCancion = req.body;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8" ));
    canciones.push(nuevaCancion); //Realiza el push a la base de datos (JSON)
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones)); //Escribe los datos en el JSON
    res.send("Cancion agregada con exito");
});

app.put("/canciones/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const nuevasDatos = req.body;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8")); // Leer el archivo JSON actual
    const cancionExistenteIndex = canciones.findIndex(c => c.id === id);   // Buscar la canción por su ID y solo si es el ID es igual de lo contrario arroja un error
    if (cancionExistenteIndex === -1) {
        return res.status(404).json({ message: "Canción no encontrada" });
    }

    // Actualizar los datos de la canción
    canciones[cancionExistenteIndex].titulo = nuevasDatos.titulo;
    canciones[cancionExistenteIndex].artista = nuevasDatos.artista;
    canciones[cancionExistenteIndex].tono = nuevasDatos.tono;

    fs.writeFileSync("repertorio.json", JSON.stringify(canciones)); // Escribir los datos actualizados en el archivo JSON
    res.json({ message: "Canción actualizada con éxito" });
});

app.delete("/canciones/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "utf8")); // Leer el archivo JSON actual
    const cancionExistenteIndex = canciones.findIndex(c => c.id === id); // Buscar la canción por su ID
    if (cancionExistenteIndex === -1) {
        return res.status(404).json({ message: "Canción no encontrada" });
    }

    canciones.splice(cancionExistenteIndex, 1); // Eliminar la canción de la lista

    fs.writeFileSync("repertorio.json", JSON.stringify(canciones)); // Escribir los datos actualizados en el archivo JSON
    res.json({ message: "Canción eliminada con éxito" });
});