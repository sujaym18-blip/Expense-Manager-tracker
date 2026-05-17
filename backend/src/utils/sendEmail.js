import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async(email, firstName, resetUrl) => {
    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Password Reset Request - Expense Manager',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the link below to create a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">© 2024 Expense Manager. All rights reserved.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

/**
 * Send budget alert email
 */
export const sendBudgetAlertEmail = async(email, firstName, categoryName, spent, limit) => {
    const percentage = ((spent / limit) * 100).toFixed(2);

    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `Budget Alert - ${categoryName} - Expense Manager`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Budget Alert</h2>
        <p>Hi ${firstName},</p>
        <p>You've exceeded ${percentage}% of your budget for <strong>${categoryName}</strong> this month.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Amount Spent:</strong> $${spent.toFixed(2)}</p>
          <p><strong>Budget Limit:</strong> $${limit.toFixed(2)}</p>
          <p><strong>Remaining:</strong> $${Math.max(0, limit - spent).toFixed(2)}</p>
        </div>
        <p>Please review your spending to stay within your budget.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">© 2024 Expense Manager. All rights reserved.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Budget alert email sent to ${email}`);
    } catch (error) {
        console.error('Error sending budget alert email:', error);
        throw new Error('Failed to send budget alert email');
    }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async(email, firstName) => {
    const mailOptions = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: 'Welcome to Expense Manager',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Expense Manager!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for signing up for Expense Manager. We're excited to help you manage your finances better!</p>
        <p>Here's what you can do with your account:</p>
        <ul>
          <li>Track income and expenses</li>
          <li>Set and monitor budgets</li>
          <li>Get spending insights with charts</li>
          <li>Export reports</li>
          <li>And much more!</li>
        </ul>
        <p>Start tracking your expenses today!</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">© 2024 Expense Manager. All rights reserved.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        // Don't throw here - account was created successfully, email failure shouldn't block it
    }
};