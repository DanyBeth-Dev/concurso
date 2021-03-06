const http = require("http")
const fs = require("fs")
const { nuevoUsuario , guardarUsuario } = require("./usuarios.js");
const { send } = require("./correo");

http.createServer((req, res) => {
    //Rutas:
    // "/" GET: Debe devolver el documento HTML disponibilizado en el apoyo
    if(req.url == "/" && req.method == "GET") {
        res.setHeader("Content-type", "text/html")
        res.end(fs.readFileSync("index.html", "utf8"))
    }
    // "/usuario" POST: Almacena un usuario
    if(req.url.startsWith("/usuario") && req.method == "POST"){
        nuevoUsuario().then(async (usuario) => {
            guardarUsuario(usuario)
            res.end(JSON.stringify(usuario))
        }).catch(e => {
            res.statusCode = 500;
            res.end();
            console.log("Error en el registro de un usuario random", e);
        });
    }
    // "/usuarios" GET: Devuelve todos los usuarios almacenados
    if(req.url.startsWith("/usuarios") && req.method == "GET"){
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync("usuarios.json", "utf8"));
    }
    // "/premio" GET: Devuelve los datos del premio
    if(req.url.startsWith("/premio") && req.method == "GET"){
        res.setHeader("Content-Type", "application/json");
        res.end(fs.readFileSync("premio.json", "utf8"));
    }
    // "/premio" PUT: Edita los datos del premio
    if(req.url.startsWith("/premio") && req.method == "PUT"){
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString()
        });
        req.on("end", () => {
            const nuevoPremio = JSON.parse(body);
            fs.writeFile("premio.json", JSON.stringify(nuevoPremio), (err) => {
                err ? console.log("Oh no ...") : console.log("Ok")
                res.end("Premio editado con éxito");
            })
        })
    }
    // "/ganador" GET: Devuelve al ganador y envía los correos electrónicos
    if(req.url == "/ganador" && req.method == "GET"){
        const premio = JSON.parse(fs.readFileSync("premio.json", "utf8")).nombre;
        const usuarios = JSON.parse(fs.readFileSync("usuarios.json", "utf8")).usuarios
        const correos = usuarios.map(u => u.correo);
        const total = usuarios.length
        const ganador = usuarios[Math.floor(Math.random() * (total - 0)) + 0]
        send(ganador, correos, premio).then(() => {
            res.end(JSON.stringify(ganador));
        }).catch(e => {
            res.statusCode = 500;
            res.end()
            console.log("Error en el envío de correos electrónicos", e);
        })
        res.end(JSON.stringify(ganador));
    }

}).listen(3000, console.log("Server ON"))