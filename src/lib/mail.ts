import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''), // Ensure no spaces
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Email Error: GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env');
    return { error: 'メール送信設定が不足しています' };
  }
  try {
    const info = await transporter.sendMail({
      from: `"Next Todo App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '【Next Todo】認証コードのお知らせ',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>認証コード</h2>
          <p>以下のコードを入力して登録を完了してください。</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${token}</span>
          </div>
          <p>このコードの有効期限は10分間です。</p>
        </div>
      `,
    });
    console.log('Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email send failed:', error);
    return { error: 'メールの送信に失敗しました' };
  }
}
