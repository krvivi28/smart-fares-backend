import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_SERVICE,
    to: user.email,
    subject: "Welcome to Hodophil!a Holidays",
    html: `
       <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    /* Add your custom CSS styles here */
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 5px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                    }
                    .logo {
                        max-width: 150px;
                    }
                    .content {
                        margin-top: 20px;
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #007BFF;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img class="logo" src="https://res.cloudinary.com/ddl5njx04/image/upload/v1730914336/logo_lhdoec.jpg" alt="Hodophil!a Holidays Logo">
                        <h1>Welcome to Hodophil!a Holidays</h1>
                    </div>
                    <div class="content">
                        <p>Hello, ${user.name}</p>
                        <p>Thank you for registering with Hodophil!a Holidays. We're excited to have you as a new member of our community.</p>
                        <p><a class="button" href="http://storefleet.com">Get Started</a></p>
                    </div>
                </div>
            </body>
            </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
