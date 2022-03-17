const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
// ------ DEPRECADO ------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//----- DEPRECADO -----

// ?
app.use(express.static("public"));

// * Configuracion FILEUPLOAD
app.use(
	expressFileUpload({
		limits: { fileSize: 5000000 },
		abortOnLimit: true,
		responseOnLimit:
			"<div><h1>El peso del archivo que intentas subir supera el limite permitido => 5mb.</h1><button><a href='/'>Volver</a></button></div><style> body{background-color: black;color: white;text-align: center;},</style>",
	}),
);

// * -------------------
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/formulario.html");
});

app.get("/Imagen", (req, res) => {
	res.sendFile(__dirname + "/collage.html");
});

// ? DELETE imgs
// ! El desafio dice que sea GET y no DELETE ¿?
app.get("/deleteImg/:nombre", (req, res) => {
	const nombre = req.params.nombre;
	// * Existe el archivo?
	fs.existsSync(__dirname + "/public/imgs/" + nombre)
	    //* Si existe lo borro
		? fs.unlinkSync(__dirname + "/public/imgs/" + nombre)
		// * Sino aviso y vuelvo a cargar la pagina
		: console.log("No existe la imagen");
	res.redirect("/Imagen");
});

// * -------------------
app.post("/Imagen", (req, res) => {
	// ? Captura del archivo
	try {
		const { target_file } = req.files;
		// ? Captura de la posicion para el archivo en el collage
		const { posicion } = req.body;

		target_file.mv(
			`${__dirname}/public/imgs/imagen-${posicion}.jpg`,
			(err) => {
				res.redirect("/Imagen");
			},
		);
	} catch (err) {
		res.send(
			"<div><h1>Recuerda cargar la imagen</h1><button><a href='/'>Volver</a></button></div><style> body{background-color: black;color: white;text-align: center;},</style>",
		);
	}
});

// * -------------------
app.listen(3000, () => {
	console.log("Servidor corriendo en el puerto 3000");
});
