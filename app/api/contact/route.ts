import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import { ImapFlow } from 'imapflow';
import MailComposer from 'nodemailer/lib/mail-composer';

// Basic payload validation
interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function validate(payload: unknown) {
  const p = payload as Partial<ContactPayload> | null | undefined;
  const errors: string[] = [];
  if (typeof p?.name !== 'string' || !p.name.trim()) errors.push('Name is required');
  if (typeof p?.email !== 'string' || !p.email.trim()) errors.push('Email is required');
  if (typeof p?.message !== 'string' || !p.message.trim()) errors.push('Message is required');
  return errors;
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) {
    console.error('SMTP not configured: missing host/port/user/pass');
    return null;
  }
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
  // Use promise API to avoid implicit any in callback
  transporter.verify().then((ok: boolean) => {
    console.log('SMTP verified:', ok);
  }).catch((err: unknown) => {
    console.error('SMTP verify failed:', err);
  });
  return transporter;
}

async function appendToSent(raw: string) {
  const host = process.env.IMAP_HOST;
  const port = process.env.IMAP_PORT ? Number(process.env.IMAP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !port || !user || !pass) return; // skip if not configured
  const client = new ImapFlow({
    host,
    port,
    secure: port === 993,
    auth: { user, pass },
  });
  try {
    await client.connect();
    const sentMailbox = process.env.IMAP_SENT_BOX || 'Sent';
    await client.append(sentMailbox, raw, ['Seen']);
  } catch (err) {
    console.error('Append to Sent failed', err);
  } finally {
    await client.logout().catch(() => {});
  }
}

function buildRawMail(mail: { from: string; to: string; subject: string; text: string; html: string }): Promise<string> {
  const composer = new (MailComposer as any)(mail);
  return new Promise((resolve, reject) => {
    composer.compile().build((err: unknown, message: Buffer) => {
      if (err) return reject(err);
      resolve(message.toString());
    });
  });
}

async function sendThankYouEmail(to: string, name: string, message: string) {
  const transport = getTransport();
  if (!transport) return; // Skip if SMTP not configured
  const fromUser = process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || fromUser || 'no-reply@example.com';
  const safeFrom = from.includes('@') ? from : fromUser;
  const safeName = name || 'there';
  const accent = '#DC7C7C';
  const base = '#3B241A';
  const bg = '#FAF0E6';
  const mail = {
    from: safeFrom!,
    to,
    subject: 'Thanks for your message',
    text: `Hi ${safeName},\n\nThanks for reaching out! I received your message and will get back to you soon.\n\nYour message:\n${message}\n\nWhat happens next?\n• I’ll review your note.\n• If I need anything else, I’ll reply to this thread.\n\nUseful links:\n• Website: https://www.isharani.in\n• Portfolio: https://www.isharani.in/wall\n• Blogs: https://www.isharani.in/blogs\n\nWarm regards,\nIsha Rani`,
    html: `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${bg};padding:0;margin:0;font-family:'Inter',Arial,sans-serif;">
        <tr>
          <td align="center" style="padding:0;margin:0;">
            <!-- Preheader (hidden) -->
            <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Thanks for reaching out — I’ll get back to you soon.</div>

            <!-- Wrapper -->
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:12px;border:1px solid rgba(59,36,26,0.08);margin:24px 12px;">
              <!-- Header -->
              <tr>
                <td style="background:${accent};background:linear-gradient(135deg, ${accent}, #F2A7A7);padding:24px 24px;color:#ffffff;">
                  <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.9;">Isha Rani — Portfolio</div>
                  <div style="font-size:20px;font-weight:800;margin-top:6px;">Thank you for your message</div>
                  <div style="font-size:14px;margin-top:6px;opacity:0.95;">I received your note and will reply soon.</div>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:24px;color:${base};">
                  <p style="margin:0 0 10px 0;font-size:16px;font-weight:700;">Hi ${safeName},</p>
                  <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:#5b443a;">Thank you for reaching out. I appreciate you taking the time to write! I’ll review your message and get back to you as soon as possible.</p>
                  <div style="margin:12px 0 16px 0;padding:14px 16px;background:rgba(220,124,124,0.08);border:1px solid rgba(220,124,124,0.32);border-radius:12px;">
                    <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${accent};font-weight:800;margin-bottom:8px;">Your message</div>
                    <div style="font-size:14px;line-height:1.7;color:${base};white-space:pre-wrap;">${message}</div>
                  </div>
                  <div style="margin:16px 0 8px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#A68B7E;font-weight:800;">What happens next</div>
                  <ul style="margin:8px 0 16px 18px;padding:0;color:#5b443a;font-size:14px;line-height:1.7;">
                    <li>I’ll review your note and any relevant links you shared.</li>
                    <li>If I need more details, I’ll reply to this thread.</li>
                    <li>Otherwise, you’ll hear from me shortly with next steps.</li>
                  </ul>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 2px 0;">
                    <tr>
                      <td style="padding-right:8px;">
                        <a href="https://www.isharani.in/wall" style="display:inline-block;background:${base};color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;">View Portfolio</a>
                      </td>
                      <td>
                        <a href="https://www.isharani.in/blogs" style="display:inline-block;background:#ffffff;color:${base};text-decoration:none;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:700;border:1px solid rgba(59,36,26,0.12);">Read Blogs</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:16px 0 0 0;font-size:13px;color:#6E5045;">Tip: You can reply directly to this email to continue the conversation.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:${bg};padding:0;border-top:1px solid rgba(59,36,26,0.08);">
                  
                  <!-- Full-width CTA band (center-aligned) -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#23150F;">
                    <tr>
                      <td align="center" style="padding:18px 22px; color:#FAF0E6;">
                        <div style="font-size:18px;font-weight:800;line-height:1.3;margin-bottom:6px;">
                          Have an idea? <span style="color:#F2A7A7;font-style:italic;">Let's build it.</span>
                        </div>
                        <div style="font-size:13px;color:#A68B7E;line-height:1.6;margin-bottom:10px;">
                          Turning concepts into polished digital experiences. I’m currently available for freelance projects.
                        </div>
                        <div>
                          <a href="mailto:me@isharani.in" style="display:inline-block;background:#FAF0E6;color:#3B241A;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:800;margin-right:8px;">Email Me</a>
                          <a href="https://www.isharani.in/build" style="display:inline-block;background:#F2A7A7;color:#3B241A;text-decoration:none;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:800;">Let's Build</a>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Socials (text links for email compatibility, center-aligned) -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};">
                    <tr>
                      <td align="center" style="padding:12px 22px;">
                        <div style="font-size:12px;line-height:1.8;">
                          <a href="#" style="color:${base};text-decoration:none;margin-right:12px;font-weight:700;">Instagram</a>
                          <a href="#" style="color:${base};text-decoration:none;margin-right:12px;font-weight:700;">LinkedIn</a>
                          <a href="#" style="color:${base};text-decoration:none;font-weight:700;">GitHub</a>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Bottom Bar (identity + nav, stacked for mobile, center-aligned) -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${bg};border-top:1px solid rgba(59,36,26,0.08);">
                    <tr>
                      <td align="center" style="padding:12px 22px;font-size:12px;color:#6E5045;vertical-align:top;">
                        <div style="font-weight:800;color:${base};margin-bottom:6px;">Isha Rani</div>
                        <div style="margin-bottom:8px;">Content Creator • Writer • Travel Vlogger</div>
                        <div style="opacity:0.85;">Website: <a href="https://www.isharani.in" style="color:${base};text-decoration:underline;">www.isharani.in</a></div>
                        <div style="margin-top:8px;color:#A68B7E;">© ${new Date().getFullYear()} Isha Rani. All rights reserved.</div>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding:0 22px 16px 22px;font-size:12px;color:#6E5045;vertical-align:top;">
                        <a href="https://www.isharani.in" style="color:${base};text-decoration:none;margin-right:12px;">Home</a>
                        <a href="https://www.isharani.in/wall" style="color:${base};text-decoration:none;margin-right:12px;">Work</a>
                        <a href="https://www.isharani.in/services" style="color:${base};text-decoration:none;margin-right:12px;">Services</a>
                        <a href="https://www.isharani.in/blogs" style="color:${base};text-decoration:none;">Blog</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Outer bottom spacer -->
            <div style="height:12px;">&nbsp;</div>
          </td>
        </tr>
      </table>
    `,
  };
  try {
    const raw = await buildRawMail(mail);
    const info = await transport.sendMail(mail);
    console.log('SMTP send OK:', { messageId: info.messageId, response: info.response });
    await appendToSent(raw);
  } catch (err) {
    console.error('SMTP send failed:', err);
    throw err;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errors = validate(body);
    if (errors.length) {
      return NextResponse.json({ success: false, error: errors.join(', ') }, { status: 400 });
    }

    const db = await getDatabase();
    const col = db.collection('contacts');

    const doc = {
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      status: 'open',
      createdAt: new Date(),
    };

    const result = await col.insertOne(doc);

    // Fire-and-forget thank-you email; do not block response
    sendThankYouEmail(doc.email, doc.name, doc.message).catch((err) => {
      console.error('Contact thank-you email failed', err);
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Contact POST error', error);
    return NextResponse.json({ success: false, error: 'Failed to submit message' }, { status: 500 });
  }
}
