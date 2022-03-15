import nodemailer from "nodemailer";
const emailRegistry = async ({ name, email, token }) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transport.sendMail({
      from: "Vet App",
      to: email,
      subject: "Account verification",
      text: "Please verify your account",
      html: `<h1>Hello ${name}!</h1><br /><p>Please verify your account,
        <a href="https://confident-hawking-834487.netlify.app/confirm/${token}">Clic here to verify</a></p><br />
          <p>if you don't create a new account, please ignore this message</p>`,
    });
   
  } catch (error) {}
};

export default emailRegistry;