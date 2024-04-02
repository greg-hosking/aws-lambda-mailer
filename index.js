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
            subject: `New Message from ${emailData.name}`,
            text: `You have received a new message from ${emailData.name} (${emailData.email}):\n\n${emailData.message}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

const sendConfirmationEmail = async (emailData) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: emailData.email,
            subject: "Thank You for Your Message",
            text: `Hello ${emailData.name},\n\nThank you for taking the time to message me. I will get back to you as soon as possible.\n\nBest,\nGreg Hosking\n\n(Here is a copy of the message you sent me)\n${emailData.message}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

exports.handler = async function (event) {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
    };

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "CORS preflight response" }),
        };
    }

    try {
        const emailData = JSON.parse(event.body);
        await sendEmail(emailData);
        await sendConfirmationEmail(emailData);

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({ message: "Email sent successfully!" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                message: "Error sending email",
                error: error.message,
            }),
        };
    }
};
