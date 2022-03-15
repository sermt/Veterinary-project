import nodemailer from "nodemailer";
const recoveryPassword = async ({ name, email, token }) => {

  const transfer = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth:{ 
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    }
});

let mailBilgi = {
    from:  process.env.EMAIL_USER,
    to: email,
    subject: "Recovery Password",
    html:`<h1>Hello ${name}!</h1><br /><p>follow the link below to recover your password,
    <a href="http://localhost:3000/forget-Password/${token}">Click here</a></p><br />
      <p>if you have not requested the recovery please ignore this message</p>`,
};

transfer.sendMail(mailBilgi, err => {
    if(err){
        console.log(err);
    }
});

};

export default recoveryPassword;