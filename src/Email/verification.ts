import { sendEmail } from './sendemail.function';

export async function emailverification(payload: any) {
  const subject = `Scavenger-Hunt ${payload.type} Verification code`;
  const content = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scavenger-Hunt Email</title>
    <style>
        body {
            background: linear-gradient(to right, #3b82f6, #6366f1);
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #1e40af;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .content {
            padding: 30px;
            color: #333;
        }
        .code-box {
            display: inline-block;
            background: #dbeafe;
            color: #1e3a8a;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            border: 2px solid #3b82f6;
            margin: 20px 0;
        }
        .footer {
            background: #111827;
            color: #d1d5db;
            text-align: center;
            padding: 15px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <table class="email-container">
        <tr>
            <td class="header">Scavenger-Hunt</td>
        </tr>
        <tr>
            <td class="content">
                <h2>Hello, ${payload.name}</h2>
                <p>Here is your  ${payload.type} Verification code:</p>
                <div style="text-align: center;">
                    <span class="code-box">${payload.code}</span>
                </div>
                <p>If you did not request this code, please ignore this email or contact our support team.</p>
            </td>
        </tr>
        <tr>
            <td class="footer">&copy; 2025 Scavenger-Hunt. All rights reserved.</td>
        </tr>
    </table>
</body>
</html>

    `;
  await sendEmail(content, subject, payload.email);
}
