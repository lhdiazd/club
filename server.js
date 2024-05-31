const fs = require("fs");
const express = require('express');
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

function readFile() {
    try {
        const data = fs.readFileSync('Deportes.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Error al obtener los deportes.');
    }
}

function writeFile(data) {
    try {
        fs.writeFileSync('Deportes.json', JSON.stringify(data));
    } catch (err) {
        throw new Error('Error al escribir en el archivo JSON.');
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/deportes', (req, res) => {
    try {
        const data = readFile();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/agregar', (req, res) => {
    try {        
        const { nombre, precio } = req.query;
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Faltan campos requeridos.' });
        }       
        const data = readFile();
        data.deportes.push({ nombre, precio });    
        writeFile(data);
        res.json({ message: 'Deporte agregado con éxito.' });
    } catch (error) {        
        res.status(500).json('Ocurrió un error en el servidor');
    }
});

app.get('/editar', (req, res) => {
    const { nombre, precio } = req.query;
    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }

    try {        
        const data = readFile();        
        const deporteIndex = data.deportes.findIndex(d => d.nombre === nombre);

        if (deporteIndex === -1) {
            return res.status(404).json({ error: 'Deporte no encontrado.' });
        }

        data.deportes[deporteIndex].precio = precio;
        writeFile(data);

        res.json({ message: 'Precio del deporte actualizado correctamente.' });

    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error al editar el precio del deporte' });
    }
});

app.get('/eliminar', (req, res) => {
    try {        
        const nombre = req.query.nombre;
        if (!nombre) {
            return res.status(400).json({ error: 'No se encontró el parámetro requerido' });
        }

        const data = readFile();        
        const deporteIndex = data.deportes.findIndex(d => d.nombre === nombre);

        if (deporteIndex === -1) {
            return res.status(404).json({ error: 'Deporte no encontrado.' });
        }
        data.deportes.splice(deporteIndex, 1);

        writeFile(data);

        res.json({ message: 'Deporte eliminado con éxito.' });

    } catch (error) {        
        res.status(500).json({ error: 'Ocurrió un error en el servidor' });
    }
});

