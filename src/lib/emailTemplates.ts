// ============================================================
// CREATO4 LAB — Premium Email Templates v2
// Minimal · Brand-consistent · No double dashes · Clean UI
//
// Brand:
//   Deep Forest Green : #1A3C2F
//   Warm Gold          : #C4A35A
//   Cream              : #FAF8F5
//   Soft Ground        : #F0EDE8
//   Muted Text         : #6B7A70
// ============================================================

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://creato4.com";
const LOGO_URL = `${APP_URL}/creato4-logo.svg`;

// ── Shared shell ─────────────────────────────────────────────
function shell(preheader: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Creato4 Lab</title>
</head>
<body style="margin:0;padding:0;background:#F0EDE8;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<span style="display:none;max-height:0;overflow:hidden;">${preheader}&nbsp;</span>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0EDE8;padding:48px 16px;">
    <tr><td align="center">

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- ── HEADER ── -->
        <tr>
          <td style="background:#1A3C2F;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
            <img src="${LOGO_URL}" alt="Creato4 Lab" width="72" height="72"
              style="width:72px;height:72px;border-radius:14px;display:block;margin:0 auto 14px;"/>
            <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
              font-size:11px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#C4A35A;">
              Engineering the Future
            </p>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="background:#FFFFFF;border-left:1px solid #E8E2D9;border-right:1px solid #E8E2D9;">
            ${body}
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="background:#1A3C2F;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <a href="${APP_URL}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                    color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;margin:0 10px;">Website</a>
                  <span style="color:rgba(250,248,245,0.2);font-size:11px;">|</span>
                  <a href="mailto:creato4lab@gmail.com" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                    color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;margin:0 10px;">Support</a>
                  <span style="color:rgba(250,248,245,0.2);font-size:11px;">|</span>
                  <a href="${APP_URL}/shop" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                    color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;margin:0 10px;">Shop</a>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                    font-size:10px;color:rgba(250,248,245,0.3);line-height:1.8;">
                    &copy; ${new Date().getFullYear()} Creato4 Technologies. All rights reserved.<br/>
                    Ahmedabad, Gujarat, India &middot; Governed by Indian Law
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Reusable row divider ──────────────────────────────────────
const HR = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:0 40px;"><div style="height:1px;background:#F0EDE8;"></div></td></tr>
</table>`;

// ── Reusable CTA button ───────────────────────────────────────
function ctaButton(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr>
      <td style="background:#1A3C2F;border-radius:50px;padding:0;">
        <a href="${url}" style="display:block;padding:14px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
          color:#FAF8F5;text-decoration:none;white-space:nowrap;">${label}</a>
      </td>
    </tr>
  </table>`;
}

// ── Reusable gold badge ───────────────────────────────────────
function badge(label: string): string {
  return `<span style="display:inline-block;background:#C4A35A;color:#1A3C2F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;
    padding:4px 12px;border-radius:50px;">${label}</span>`;
}

// ── Reusable meta row ─────────────────────────────────────────
function metaRow(label: string, value: string, isLast = false): string {
  return `<tr>
    <td style="padding:14px 24px;${isLast ? "" : "border-bottom:1px solid #F0EDE8;"}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:10px;font-weight:700;color:#6B7A70;text-transform:uppercase;letter-spacing:1.5px;">${label}</td>
          <td align="right" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:12px;font-weight:600;color:#1A3C2F;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

// ============================================================
// 1. WELCOME EMAIL
// ============================================================
export function getWelcomeEmail({ name, email }: { name: string; email: string }): string {
  const body = `
    <!-- Hero -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:56px 40px 40px;text-align:center;">
          <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#C4A35A;">
            Welcome Aboard
          </p>
          <h1 style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:30px;font-weight:800;color:#1A3C2F;letter-spacing:-0.5px;line-height:1.2;">
            Hello, ${name}
          </h1>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:15px;color:#6B7A70;line-height:1.7;max-width:380px;margin:0 auto;">
            Your Creato4 Lab account is ready. Explore engineering blueprints, source code, and PCB designs built by our team.
          </p>
        </td>
      </tr>
    </table>

    ${HR}

    <!-- Feature list -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:36px 40px;">
        <p style="margin:0 0 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6B7A70;">
          What you get
        </p>

        <!-- Row 1 -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td width="44" valign="middle">
              <div style="width:40px;height:40px;background:#1A3C2F;border-radius:10px;
                text-align:center;line-height:40px;font-size:18px;">🛍️</div>
            </td>
            <td style="padding-left:14px;">
              <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:13px;font-weight:700;color:#1A3C2F;">Engineering Catalog</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:12px;color:#6B7A70;">CAD files, embedded code, PCB schematics &amp; more.</p>
            </td>
          </tr>
        </table>

        <!-- Row 2 -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td width="44" valign="middle">
              <div style="width:40px;height:40px;background:#C4A35A;border-radius:10px;
                text-align:center;line-height:40px;font-size:18px;">📐</div>
            </td>
            <td style="padding-left:14px;">
              <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:13px;font-weight:700;color:#1A3C2F;">Student Zone Blueprints</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:12px;color:#6B7A70;">Ready-to-build project kits for university &amp; personal projects.</p>
            </td>
          </tr>
        </table>

        <!-- Row 3 -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="44" valign="middle">
              <div style="width:40px;height:40px;background:#2D6B52;border-radius:10px;
                text-align:center;line-height:40px;font-size:18px;">💬</div>
            </td>
            <td style="padding-left:14px;">
              <p style="margin:0 0 2px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:13px;font-weight:700;color:#1A3C2F;">Free Consultation</p>
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:12px;color:#6B7A70;">Discuss your product idea with our engineering team.</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    ${HR}

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:36px 40px 48px;text-align:center;">
          ${ctaButton("Browse the Catalog", `${APP_URL}/shop`)}
          <p style="margin:20px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:11px;color:#6B7A70;">Signed in as <strong style="color:#1A3C2F;">${email}</strong></p>
        </td>
      </tr>
    </table>
  `;
  return shell(`Welcome, ${name}. Your Creato4 Lab account is ready.`, body);
}

// ============================================================
// 2. LOGIN ALERT EMAIL
// ============================================================
export function getLoginAlertEmail({
  name, email, time, device, location,
}: {
  name: string; email: string; time: string; device: string; location?: string;
}): string {
  const body = `
    <!-- Hero -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:52px 40px 36px;text-align:center;">
          <div style="width:60px;height:60px;background:#FAF8F5;border:2px solid #E8E2D9;border-radius:14px;
            text-align:center;line-height:60px;font-size:26px;margin:0 auto 20px;">🔐</div>
          <h1 style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:24px;font-weight:800;color:#1A3C2F;letter-spacing:-0.3px;">New Sign-In Detected</h1>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:14px;color:#6B7A70;line-height:1.6;max-width:340px;margin:0 auto;">
            A new session was started on your account, <strong style="color:#1A3C2F;">${name}</strong>.
          </p>
        </td>
      </tr>
    </table>

    ${HR}

    <!-- Details table -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:32px 40px;">
        <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6B7A70;">
          Session Details
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="border:1px solid #E8E2D9;border-radius:12px;overflow:hidden;">
          ${metaRow("Account", email)}
          ${metaRow("Time", time)}
          ${metaRow("Device", device)}
          ${location ? metaRow("Location", location, true) : metaRow("Location", "India", true)}
        </table>
      </td></tr>
    </table>

    ${HR}

    <!-- Warning -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:20px 40px;background:#FFFBF0;border-left:3px solid #C4A35A;">
          <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:12px;font-weight:700;color:#7A5C1E;">Not you?</p>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:12px;color:#8A6B30;line-height:1.6;">
            Contact us at <a href="mailto:creato4lab@gmail.com"
              style="color:#C4A35A;font-weight:600;">creato4lab@gmail.com</a> immediately to secure your account.
          </p>
        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:36px 40px 48px;text-align:center;">
          ${ctaButton("Go to Dashboard", `${APP_URL}/dashboard`)}
        </td>
      </tr>
    </table>
  `;
  return shell("New sign-in detected on your Creato4 Lab account.", body);
}

// ============================================================
// 3. ORDER CONFIRMATION EMAIL
// ============================================================
export function getOrderConfirmationEmail({
  name, email, orderId, productName, licenseType, amount, licenseKey, date,
}: {
  name: string; email: string; orderId: string; productName: string;
  licenseType: string; amount: number; licenseKey: string; date: string;
}): string {
  const licenseDesc =
    licenseType === "STUDENT" ? "Personal &amp; academic use" :
    licenseType === "COMMERCIAL" ? "Up to 3 client projects" :
    "Unlimited enterprise use";

  const body = `
    <!-- Hero -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:52px 40px 36px;text-align:center;">
          <div style="width:60px;height:60px;background:#F0FDF4;border:2px solid #86EFAC;border-radius:14px;
            text-align:center;line-height:60px;font-size:26px;margin:0 auto 20px;">✅</div>
          ${badge("Payment Successful")}
          <h1 style="margin:16px 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:26px;font-weight:800;color:#1A3C2F;letter-spacing:-0.3px;">Order Confirmed</h1>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:14px;color:#6B7A70;line-height:1.6;max-width:360px;margin:0 auto;">
            Thank you, <strong style="color:#1A3C2F;">${name}</strong>. Your digital asset is waiting in your dashboard.
          </p>
        </td>
      </tr>
    </table>

    ${HR}

    <!-- Product card -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:32px 40px;">
        <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6B7A70;">
          What you purchased
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background:#FAF8F5;border:1px solid #E8E2D9;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid #E8E2D9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                      font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#C4A35A;">
                      ${licenseType} LICENSE
                    </p>
                    <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                      font-size:15px;font-weight:700;color:#1A3C2F;">${productName}</p>
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                      font-size:12px;color:#6B7A70;">${licenseDesc}</p>
                  </td>
                  <td align="right" valign="top">
                    <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                      font-size:20px;font-weight:800;color:#1A3C2F;">
                      &#8377;${amount.toLocaleString("en-IN")}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${metaRow("Order ID", `#${orderId.slice(-10).toUpperCase()}`)}
          ${metaRow("Date", date)}
          ${metaRow("Billed To", email, true)}
        </table>
      </td></tr>
    </table>

    ${HR}

    <!-- License Key -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:28px 40px;">
        <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
          font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6B7A70;">
          License Key
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="background:#1A3C2F;border-radius:10px;">
          <tr>
            <td style="padding:18px 24px;text-align:center;">
              <p style="margin:0 0 6px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;
                color:rgba(250,248,245,0.4);">Keep this safe</p>
              <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:13px;
                font-weight:700;color:#C4A35A;letter-spacing:2px;word-break:break-all;">
                ${licenseKey}
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    ${HR}

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:32px 40px 48px;text-align:center;">
          ${ctaButton("Access Your Downloads", `${APP_URL}/dashboard`)}
          <p style="margin:18px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:11px;color:#6B7A70;">
            All purchases are safely stored in your dashboard.
          </p>
        </td>
      </tr>
    </table>
  `;
  return shell(`Order confirmed for ${productName}. Access your download now.`, body);
}

// ============================================================
// 4. PASSWORD RESET EMAIL
// ============================================================
export function getPasswordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }): string {
  const body = `
    <!-- Hero -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:52px 40px 36px;text-align:center;">
          <div style="width:60px;height:60px;background:#FAF8F5;border:2px solid #E8E2D9;border-radius:14px;
            text-align:center;line-height:60px;font-size:26px;margin:0 auto 20px;">🔑</div>
          <h1 style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:24px;font-weight:800;color:#1A3C2F;letter-spacing:-0.3px;">Reset Your Password</h1>
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:14px;color:#6B7A70;line-height:1.6;max-width:340px;margin:0 auto;">
            Hi <strong style="color:#1A3C2F;">${name}</strong>, use the button below to set a new password.
            This link expires in <strong style="color:#1A3C2F;">1 hour</strong>.
          </p>
        </td>
      </tr>
    </table>

    ${HR}

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:36px 40px;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="background:#C4A35A;border-radius:50px;padding:0;">
                <a href="${resetUrl}" style="display:block;padding:14px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                  font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
                  color:#1A3C2F;text-decoration:none;white-space:nowrap;">Reset Password</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${HR}

    <!-- Security note -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:20px 40px 44px;">
          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
            font-size:12px;color:#6B7A70;line-height:1.6;text-align:center;">
            If you didn't request this, your account is safe. You can ignore this email.<br/>
            Never share this link with anyone.
          </p>
        </td>
      </tr>
    </table>
  `;
  return shell("Reset your Creato4 Lab password. Link expires in 1 hour.", body);
}
