const express = require("express");
const app = express();
const cors = require("cors");

const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://mukeshacademy.com",
      "https://tutor.avimukesh.com",
    ],
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  if (name.length === 0 || email.length === 0 || message.length === 0)
    return res.status(400).send({ message: "Please provide all fields." });

  var transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "enquiries@mukeshacademy.com",
    to: "avimukesh10@gmail.com",
    subject: `Tutoring Enquiry ${name}`,
    text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
    `,
  };

  // Send the email
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to send email due to server error.",
      });
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json({
        status: "success",
        message: "Email successfully sent",
      });
    }
  });

  res.status(200).send({ message: "Email sent" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
