import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) {
    return transporter;
  }

  const host = process.env.EMAIL_SMTP_HOST;
  const port = process.env.EMAIL_SMTP_PORT
    ? Number(process.env.EMAIL_SMTP_PORT)
    : 587;
  const user = process.env.EMAIL_SMTP_USER;
  const pass = process.env.EMAIL_SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const sender =
    process.env.EMAIL_FROM ?? "MatchMeUp Foundry <no-reply@matchmeupfoundry.com>";

  const transport = getTransporter();
  if (!transport) {
    console.warn(
      "Email transport not configured. Email content:\n",
      JSON.stringify({ sender, ...options }, null, 2),
    );
    return;
  }

  await transport.sendMail({
    from: sender,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}

