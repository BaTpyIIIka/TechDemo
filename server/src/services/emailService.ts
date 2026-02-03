import { transporter, emailConfig } from '../config/email';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const emailService = {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: emailConfig.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  },

  async sendReminderEmail(email: string, opportunityName: string, message?: string): Promise<boolean> {
    const subject = `Reminder: ${opportunityName}`;
    const text = message || `This is a reminder about the opportunity: ${opportunityName}`;
    const html = `
      <h2>Opportunity Reminder</h2>
      <p><strong>Opportunity:</strong> ${opportunityName}</p>
      <p>${message || 'This is a reminder to follow up on this opportunity.'}</p>
    `;

    return this.sendEmail({ to: email, subject, text, html });
  },
};
