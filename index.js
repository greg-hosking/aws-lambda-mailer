const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

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
        const data = JSON.parse(event.body);

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: `New Message from ${data.name}`,
            text: `You have received a new message from ${data.name} (${data.email}):\n\n${data.message}`,
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: data.email,
            subject: "Thank You for Your Message",
            text: `Hello ${data.name},\n\nThank you for taking the time to message me! I will get back to you as soon as possible.\n\nBest,\nGreg Hosking\n\n(Here is a copy of the message you sent me)\n${data.message}`,
        });

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
