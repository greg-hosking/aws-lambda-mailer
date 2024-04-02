const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

const sendEmail = async (emailData) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: `New Contact from ${emailData.name}`,
            text: `You have received a new message from ${emailData.name} (${emailData.email}):\n\n${emailData.message}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

exports.handler = async function (event) {
    try {
        // const emailData = JSON.parse(event.body);
        // await sendEmail(emailData);

        return {
            statusCode: 200,
            // body: JSON.stringify({ message: "Email sent successfully!" }),
            body: JSON.stringify({ event: event, eventBody: event.body }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error sending email",
                error: error.message,
            }),
        };
    }
};
