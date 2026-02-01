import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    console.log('🔧 sendEmail called with:', { email: options.email, otp: options.otp });
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER);
    console.log('🔐 EMAIL_PASS length:', process.env.EMAIL_PASS?.length, 'chars');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');

    const mailOptions = {
      from: `"Flat-Mate Support" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4CAF50;">Verify Your Email</h2>
          <p>Your 6-digit verification code is:</p>
          <h1 style="color: #333; letter-spacing: 10px; font-size: 36px;">${options.otp}</h1>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    throw error;
  }
};

export default sendEmail;