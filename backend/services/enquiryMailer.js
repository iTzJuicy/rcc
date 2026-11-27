import nodemailer from "nodemailer";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email notifications are not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  const port = Number(SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid TCP port.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export async function sendEnquiryNotifications(enquiry) {
  const { ENQUIRY_NOTIFICATION_EMAIL, SMTP_USER, SMTP_FROM } = process.env;
  if (!ENQUIRY_NOTIFICATION_EMAIL) {
    throw new Error("ENQUIRY_NOTIFICATION_EMAIL must be configured for lead alerts.");
  }

  const transport = createTransport();
  const from = SMTP_FROM || SMTP_USER;
  const subject = enquiry.subject || "New website enquiry";
  const text = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Subject: ${subject}`,
    "",
    enquiry.message,
  ].join("\n");
  const html = `<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p><p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p><p><strong>Phone:</strong> ${escapeHtml(enquiry.phone || "Not provided")}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(enquiry.message).replace(/\n/g, "<br>")}</p>`;

  const results = await Promise.allSettled([
    transport.sendMail({
      from,
      to: ENQUIRY_NOTIFICATION_EMAIL,
      subject: `New enquiry: ${subject}`,
      text,
      html,
    }),
    transport.sendMail({
      from,
      to: enquiry.email,
      subject: "We received your enquiry",
      text: `Hello ${enquiry.name},\n\nWe have received your enquiry and our team will review it. Thank you for contacting RCC Infrastructure.`,
    }),
  ]);
  await transport.close();

  const failures = results.filter((result) => result.status === "rejected");
  if (failures.length) {
    throw new AggregateError(
      failures.map((failure) => failure.reason),
      `${failures.length} enquiry notification email(s) failed to send.`
    );
  }
}
