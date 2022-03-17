import nodemailer from "nodemailer";
// sending an email to verify
const emailRegistry = async ({ name, email, token }) => {
  const transfer = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transfer.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account verification",
        text: "Please verify your account",
        html: `<h1>Hello ${name}!</h1><br /><p>Please verify your account,
        <a href="https://confident-hawking-834487.netlify.app/confirm/${token}"> Click here to verify.</a></p><br />
          <p>If you don't create a new account, please ignore this message.</p>`,
      },
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export default emailRegistry;