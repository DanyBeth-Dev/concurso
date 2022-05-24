const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sala10javascriptprueba@gmail.com",
    pass: "pruebajavascript",
  },
  tls: {
    rejectUnauthorized: false,
  }
});

const send = async (ganador, correos, premio) => {
  let mailOptions = {
    from: "sala10javascriptprueba@gmail.com",
    to: ["hg.danielabelen@gmail.com"].concat(correos),
    subject: `¡${ganador.nombre} ha ganado!`,
    html: `<h3>Anuncio: El ganador de ¿Quién ganará? fue ${ganador.nombre} y ha ganado ${premio}. <br/> Gracias a todos por participar.</h3>`,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (e) {
    throw e;
  }
};

module.exports = { send };
