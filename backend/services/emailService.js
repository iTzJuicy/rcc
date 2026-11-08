import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    console.log(`[Email Service] SMTP transporter configured for host: ${host}`);
  }

  return transporter;
}

/**
 * Send lead notification to admin and confirmation email to client
 */
export async function notifyNewLead(enquiry) {
  const mailer = getTransporter();
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || "info@rccinfrastructure.com";
  const fromAddress = process.env.SMTP_FROM || `"RCC Infrastructure" <${adminEmail}>`;

  const isQuote = Boolean(enquiry.projectTitle || enquiry.budget);
  const leadType = isQuote ? "Quotation Request" : "General Enquiry";

  // 1. Admin Notification Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0B1626; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #E5242B; letter-spacing: 1px;">RCC INFRASTRUCTURE</h2>
        <p style="margin: 4px 0 0; font-size: 14px; color: #d1d5db;">New ${leadType} Received</p>
      </div>

      <div style="padding: 24px; background: #ffffff;">
        <h3 style="margin-top: 0; color: #0B1626;">Lead Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 140px;"><strong>Client Name:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${enquiry.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; color: #111827;"><a href="mailto:${enquiry.email}" style="color: #E5242B;">${enquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0; color: #111827;"><a href="tel:${enquiry.phone || ''}" style="color: #111827;">${enquiry.phone || 'Not provided'}</a></td>
          </tr>
          ${enquiry.projectTitle ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Project:</strong></td>
            <td style="padding: 8px 0; color: #E5242B; font-weight: bold;">${enquiry.projectTitle}</td>
          </tr>` : ''}
          ${enquiry.budget ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Budget:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${enquiry.budget}</td>
          </tr>` : ''}
          ${enquiry.timeline ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Timeline:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${enquiry.timeline}</td>
          </tr>` : ''}
          ${enquiry.location ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Project Location:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${enquiry.location}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Subject:</strong></td>
            <td style="padding: 8px 0; color: #111827;">${enquiry.subject || 'Website Inquiry'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background-color: #f9fafb; padding: 16px; border-radius: 6px; border-left: 4px solid #E5242B;">
          <strong style="color: #0B1626; display: block; margin-bottom: 6px;">Message / Requirements:</strong>
          <p style="margin: 0; color: #374151; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${enquiry.message}</p>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
        Received on ${new Date().toLocaleString()} • RCC Infrastructure Admin System
      </div>
    </div>
  `;

  // 2. Client Confirmation Email
  const clientHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0B1626; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #E5242B; letter-spacing: 1px;">RCC INFRASTRUCTURE</h2>
        <p style="margin: 4px 0 0; font-size: 14px; color: #d1d5db;">Building Quality & Trust</p>
      </div>

      <div style="padding: 24px; background: #ffffff;">
        <p style="font-size: 16px; color: #111827;">Hello <strong>${enquiry.name}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.7;">
          Thank you for reaching out to RCC Infrastructure. We have received your ${isQuote ? 'quotation request' : 'inquiry'} and our engineering & estimation team is reviewing your project details.
        </p>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.7;">
          One of our project specialists will contact you within 24 to 48 business hours to discuss your requirements.
        </p>

        <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-radius: 6px; font-size: 13px; color: #374151;">
          <strong style="display: block; color: #0B1626; margin-bottom: 4px;">Need immediate assistance?</strong>
          <div>Phone: <a href="tel:+919876543210" style="color: #E5242B;">+91 98765 43210</a></div>
          <div>Email: <a href="mailto:${adminEmail}" style="color: #E5242B;">${adminEmail}</a></div>
          <div>Location: Mangalore, Karnataka, India</div>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 14px; text-align: center; font-size: 12px; color: #6b7280;">
        © ${new Date().getFullYear()} RCC Infrastructure. All rights reserved.
      </div>
    </div>
  `;

  if (!mailer) {
    console.log(`[Email Service Notice] SMTP is unconfigured. Lead #${enquiry._id} from ${enquiry.name} (${enquiry.email}) is safely recorded in the database.`);
    return;
  }

  try {
    // Send email to admin
    await mailer.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: enquiry.email,
      subject: `[New Lead] ${leadType} from ${enquiry.name}`,
      html: adminHtml,
    });
    console.log(`[Email Service] Notification sent to admin (${adminEmail}) for lead #${enquiry._id}`);

    // Send confirmation to client
    if (enquiry.email && enquiry.email.includes("@")) {
      await mailer.sendMail({
        from: fromAddress,
        to: enquiry.email,
        subject: `Thank you for contacting RCC Infrastructure`,
        html: clientHtml,
      });
      console.log(`[Email Service] Confirmation sent to client (${enquiry.email})`);
    }
  } catch (err) {
    console.error(`[Email Service Error] Failed to send email for lead #${enquiry._id}:`, err.message);
  }
}

export default { notifyNewLead };
