import { HttpStatus } from '@nestjs/common';
import { ReadStream } from 'fs';
const nodemailer = require('nodemailer');

export class EmailAttachmentDTO {
  filename: string;
  content: ReadStream;
}

export const sendEmail = async (
  html: string,
  subject: string,
  recipientEmail: string,
  attachments?: EmailAttachmentDTO[],
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: process.env.ADMIN_EMAIL, // your_gmail e.g user@gmail.com
        pass: process.env.ADMIN_PASSWORD , //google app password
      },
    });

    const info = await transporter.sendMail({
      from: `auth" <${process.env.EMAIL_ADMIN}>`,
      to: recipientEmail,
      subject,
      html,
      attachments,
    });

    console.log(`✅ Email sent successfully: ${info.messageId}`);

    return {
      message: `Nodemailer sent message: ${info.messageId}`,
      code: HttpStatus.OK,
      success: true,
    };
  } catch (error) {
    console.error(`❌ Email sending failed:`, error);
    return {
      success: false,
      message: 'Email not sent',
      code: HttpStatus.BAD_GATEWAY,
    };
  }
};
