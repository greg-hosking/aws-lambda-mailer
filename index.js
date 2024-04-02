const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = async () => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: "email@example.com",
            subject: "Example Subject",
            text: "Example email body.",
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

exports.handler = async function (event) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Lambda!", event: event }),
    };
    return response;
};
