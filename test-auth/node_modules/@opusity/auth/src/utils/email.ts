import nodemailer from 'nodemailer'

export interface EmailOptions {
    to:string,
    subject:string,
    html: string
}


export async function sendEmail(options: EmailOptions): Promise<void>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to:options.to,
        subject: options.subject,
        html: options.html
    })
}


export function verificationEmailTemplate(name:string,verifyUrl: string):string{
     return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hey ${name}, verify your email!</h2>
      <p>Click the button below to verify your account:</p>
      <a href="${verifyUrl}" 
         style="background:#4F46E5; color:white; padding:12px 24px; 
                border-radius:6px; text-decoration:none; display:inline-block;">
        Verify Email
      </a>
      <p style="color:#888; margin-top:20px;">This link expires in 24 hours.</p>
    </div>
  `;
}