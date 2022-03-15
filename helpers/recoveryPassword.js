import nodemailer from "nodemailer";
const recoveryPassword = async ({ name, email, token }) => {
  const transport = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
});

  try {
    const info = await transport.sendMail({
      from: "Vet App",
      to: email,
      subject: "Recovery Password",
      text: "Recovery Password",
      html: `<h1>Hello ${name}!</h1><br /><p>follow the link below to recover your password,
        <a href="http://localhost:3000/forget-Password/${token}">Click here</a></p><br />
          <p>if you have not requested the recovery please ignore this message</p>`,
    });
    
  } catch (error) {}
};

export default recoveryPassword;