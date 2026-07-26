// ============================================================
// CREATO4 LAB — Premium Email Templates
// Brand Colors:
//   Deep Forest Green : #1A3C2F
//   Warm Gold          : #C4A35A
//   Cream              : #FAF8F5
//   Muted Green        : #5C6B60
// ============================================================

const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #F0EDE8; }
`;

function emailWrapper(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Creato4 Lab</title>
  <style>${BASE_STYLES}</style>
</head>
<body style="margin:0;padding:0;background-color:#F0EDE8;font-family:'Inter',-apple-system,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>` : ""}
  
  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F0EDE8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          
          <!-- HEADER -->
          <tr>
            <td style="background-color:#1A3C2F;border-radius:20px 20px 0 0;padding:36px 48px 32px;text-align:center;position:relative;overflow:hidden;">
              <!-- Subtle pattern overlay (decorative) -->
              <div style="position:absolute;top:0;left:0;right:0;bottom:0;opacity:0.04;background-image:repeating-linear-gradient(45deg,#FAF8F5 0,#FAF8F5 1px,transparent 0,transparent 50%);background-size:20px 20px;pointer-events:none;"></div>
              
              <!-- Logo wordmark -->
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center">
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <!-- Icon badge -->
                      <div style="width:44px;height:44px;background:linear-gradient(135deg,#C4A35A,#D4B870);border-radius:12px;display:inline-block;line-height:44px;text-align:center;font-size:22px;vertical-align:middle;">⚡</div>
                      <span style="display:inline-block;font-size:26px;font-weight:900;color:#FAF8F5;letter-spacing:-0.5px;vertical-align:middle;margin-left:10px;">CREATO4</span>
                      <span style="display:inline-block;font-size:11px;font-weight:600;color:#C4A35A;letter-spacing:3px;text-transform:uppercase;vertical-align:middle;margin-left:4px;">LAB</span>
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="color:rgba(250,248,245,0.45);font-size:11px;margin-top:10px;letter-spacing:2px;text-transform:uppercase;">Engineering the Future</p>
            </td>
          </tr>
          
          <!-- BODY -->
          <tr>
            <td style="background-color:#FFFFFF;padding:0;border-left:1px solid #E8E2D9;border-right:1px solid #E8E2D9;">
              ${content}
            </td>
          </tr>
          
          <!-- FOOTER -->
          <tr>
            <td style="background-color:#1A3C2F;border-radius:0 0 20px 20px;padding:28px 48px;text-align:center;">
              <p style="color:rgba(250,248,245,0.35);font-size:11px;margin-bottom:14px;letter-spacing:1.5px;text-transform:uppercase;">Connect With Us</p>
              <table align="center" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="https://creato4.com" style="color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;">Website</a>
                  </td>
                  <td style="color:rgba(250,248,245,0.2);font-size:11px;">|</td>
                  <td style="padding:0 6px;">
                    <a href="mailto:creato4lab@gmail.com" style="color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;">Support</a>
                  </td>
                  <td style="color:rgba(250,248,245,0.2);font-size:11px;">|</td>
                  <td style="padding:0 6px;">
                    <a href="/shop" style="color:#C4A35A;text-decoration:none;font-size:11px;font-weight:600;">Shop</a>
                  </td>
                </tr>
              </table>
              <p style="color:rgba(250,248,245,0.25);font-size:10px;margin-top:20px;line-height:1.6;">
                © ${new Date().getFullYear()} Creato4 Technologies. All rights reserved.<br/>
                Ahmedabad, Gujarat, India · Governed by Indian Law
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function divider(): string {
  return `<tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(to right,transparent,#E8E2D9,transparent);"></div></td></tr>`;
}

// ============================================================
// 1. WELCOME EMAIL
// ============================================================
export function getWelcomeEmail({ name, email }: { name: string; email: string }): string {
  const content = `
    <!-- Hero section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:56px 48px 40px;text-align:center;background:linear-gradient(180deg,rgba(26,60,47,0.03) 0%,#FFFFFF 100%);">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#1A3C2F,#2D6B52);border-radius:20px;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:34px;line-height:72px;text-align:center;">🚀</div>
          <h1 style="font-size:28px;font-weight:900;color:#1A3C2F;letter-spacing:-0.5px;margin-bottom:12px;line-height:1.2;">Welcome to Creato4 Lab</h1>
          <p style="font-size:15px;color:#5C6B60;line-height:1.7;max-width:400px;margin:0 auto;">Your engineering journey starts now, <strong style="color:#1A3C2F;">${name}</strong>. We're thrilled to have you in the community.</p>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:40px 48px;">
          <h2 style="font-size:13px;font-weight:800;color:#1A3C2F;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px;">What you can do now</h2>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:0 0 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:14px;padding:20px;border:1px solid #E8E2D9;">
                  <tr>
                    <td width="48" valign="middle" style="padding-right:16px;">
                      <div style="width:44px;height:44px;background:#1A3C2F;border-radius:12px;text-align:center;line-height:44px;font-size:20px;">🛍️</div>
                    </td>
                    <td>
                      <p style="font-weight:700;color:#1A3C2F;font-size:14px;margin-bottom:3px;">Browse the Engineering Catalog</p>
                      <p style="font-size:12px;color:#5C6B60;">CAD files, source code, PCB designs & embedded systems.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 0 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:14px;padding:20px;border:1px solid #E8E2D9;">
                  <tr>
                    <td width="48" valign="middle" style="padding-right:16px;">
                      <div style="width:44px;height:44px;background:#C4A35A;border-radius:12px;text-align:center;line-height:44px;font-size:20px;">📐</div>
                    </td>
                    <td>
                      <p style="font-weight:700;color:#1A3C2F;font-size:14px;margin-bottom:3px;">Student Zone Blueprints</p>
                      <p style="font-size:12px;color:#5C6B60;">Ready-made project kits for university & personal builds.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:14px;padding:20px;border:1px solid #E8E2D9;">
                  <tr>
                    <td width="48" valign="middle" style="padding-right:16px;">
                      <div style="width:44px;height:44px;background:#2D6B52;border-radius:12px;text-align:center;line-height:44px;font-size:20px;">💬</div>
                    </td>
                    <td>
                      <p style="font-weight:700;color:#1A3C2F;font-size:14px;margin-bottom:3px;">Discuss Your Next Big Idea</p>
                      <p style="font-size:12px;color:#5C6B60;">Get a free consultation with our engineering team.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:36px 48px 48px;text-align:center;">
          <a href="https://creato4.com/shop" style="display:inline-block;background:linear-gradient(135deg,#1A3C2F,#2D6B52);color:#FAF8F5;font-size:13px;font-weight:800;text-decoration:none;padding:16px 40px;border-radius:50px;letter-spacing:1.5px;text-transform:uppercase;">Explore the Catalog →</a>
          <p style="margin-top:20px;font-size:11px;color:#5C6B60;">Registered as <strong>${email}</strong></p>
        </td>
      </tr>
    </table>
  `;
  return emailWrapper(content, `Welcome to Creato4 Lab, ${name}! Your engineering journey begins.`);
}

// ============================================================
// 2. LOGIN ALERT EMAIL
// ============================================================
export function getLoginAlertEmail({ name, email, time, device, location }: { name: string; email: string; time: string; device: string; location?: string }): string {
  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:48px 48px 32px;text-align:center;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#C4A35A,#D4B870);border-radius:20px;margin:0 auto 24px;font-size:34px;line-height:72px;text-align:center;">🔐</div>
          <h1 style="font-size:26px;font-weight:900;color:#1A3C2F;margin-bottom:10px;letter-spacing:-0.3px;">New Sign-In Detected</h1>
          <p style="font-size:14px;color:#5C6B60;line-height:1.6;max-width:400px;margin:0 auto;">Hey <strong style="color:#1A3C2F;">${name}</strong>, a new login was recorded on your Creato4 Lab account.</p>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:32px 48px;">
          <h2 style="font-size:11px;font-weight:800;color:#5C6B60;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:20px;">Login Details</h2>
          
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:16px;border:1px solid #E8E2D9;overflow:hidden;">
            <tr>
              <td style="padding:18px 24px;border-bottom:1px solid #E8E2D9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;width:120px;">Account</td>
                    <td style="font-size:13px;font-weight:600;color:#1A3C2F;text-align:right;">${email}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;border-bottom:1px solid #E8E2D9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Time</td>
                    <td style="font-size:13px;font-weight:600;color:#1A3C2F;text-align:right;">${time}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 24px;${location ? 'border-bottom:1px solid #E8E2D9;' : ''}">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Device</td>
                    <td style="font-size:13px;font-weight:600;color:#1A3C2F;text-align:right;">${device}</td>
                  </tr>
                </table>
              </td>
            </tr>
            ${location ? `
            <tr>
              <td style="padding:18px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Location</td>
                    <td style="font-size:13px;font-weight:600;color:#1A3C2F;text-align:right;">${location}</td>
                  </tr>
                </table>
              </td>
            </tr>` : ""}
          </table>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:28px 48px;background:linear-gradient(135deg,#FFF8E7,#FFF3D4);border-left:4px solid #C4A35A;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="28" valign="top" style="padding-right:12px;font-size:18px;">⚠️</td>
              <td>
                <p style="font-size:13px;font-weight:700;color:#7A5C1E;margin-bottom:4px;">Wasn't you?</p>
                <p style="font-size:12px;color:#8A6B30;line-height:1.6;">If you don't recognize this login, please <a href="mailto:creato4lab@gmail.com" style="color:#C4A35A;font-weight:700;">contact our support team</a> immediately to secure your account.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 48px;text-align:center;">
          <a href="https://creato4.com/dashboard" style="display:inline-block;background:#1A3C2F;color:#FAF8F5;font-size:12px;font-weight:800;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:1.5px;text-transform:uppercase;">Go to Dashboard →</a>
        </td>
      </tr>
    </table>
  `;
  return emailWrapper(content, `New sign-in detected for your Creato4 Lab account.`);
}

// ============================================================
// 3. ORDER CONFIRMATION EMAIL
// ============================================================
export function getOrderConfirmationEmail({
  name,
  email,
  orderId,
  productName,
  licenseType,
  amount,
  licenseKey,
  date,
}: {
  name: string;
  email: string;
  orderId: string;
  productName: string;
  licenseType: string;
  amount: number;
  licenseKey: string;
  date: string;
}): string {
  const licenseDesc =
    licenseType === "STUDENT"
      ? "Personal projects & academic use only"
      : licenseType === "COMMERCIAL"
      ? "Up to 3 client projects, internal team use"
      : "Unlimited projects within a single legal entity";

  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Hero -->
      <tr>
        <td style="padding:56px 48px 36px;text-align:center;background:linear-gradient(180deg,rgba(26,60,47,0.04) 0%,#FFFFFF 100%);">
          <div style="width:80px;height:80px;background:linear-gradient(135deg,#1A3C2F,#2D6B52);border-radius:24px;margin:0 auto 24px;font-size:38px;line-height:80px;text-align:center;">✅</div>
          <div style="display:inline-block;background:linear-gradient(135deg,#EDFDF5,#D4F5E5);border:1px solid #86EFAC;border-radius:50px;padding:6px 18px;margin-bottom:20px;">
            <span style="font-size:11px;font-weight:800;color:#166534;letter-spacing:2px;text-transform:uppercase;">Payment Successful</span>
          </div>
          <h1 style="font-size:28px;font-weight:900;color:#1A3C2F;letter-spacing:-0.5px;margin-bottom:12px;line-height:1.2;">Order Confirmed!</h1>
          <p style="font-size:14px;color:#5C6B60;max-width:400px;margin:0 auto;line-height:1.7;">Thank you, <strong style="color:#1A3C2F;">${name}</strong>. Your digital asset is ready for download from your dashboard.</p>
        </td>
      </tr>
      ${divider()}
      
      <!-- Order Details -->
      <tr>
        <td style="padding:36px 48px;">
          <h2 style="font-size:11px;font-weight:800;color:#5C6B60;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:20px;">Order Summary</h2>
          
          <!-- Product card -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:16px;border:1px solid #E8E2D9;margin-bottom:20px;overflow:hidden;">
            <tr>
              <td style="padding:24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <div style="display:inline-block;background:#1A3C2F;color:#FAF8F5;font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:50px;margin-bottom:10px;">${licenseType} LICENSE</div>
                      <p style="font-size:16px;font-weight:800;color:#1A3C2F;margin-bottom:4px;">${productName}</p>
                      <p style="font-size:12px;color:#5C6B60;">${licenseDesc}</p>
                    </td>
                    <td style="text-align:right;vertical-align:top;">
                      <p style="font-size:22px;font-weight:900;color:#1A3C2F;">₹${amount.toLocaleString("en-IN")}</p>
                      <p style="font-size:11px;color:#5C6B60;">incl. taxes</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#F0EDE8;padding:16px 24px;border-top:1px solid #E8E2D9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Total Paid</td>
                    <td style="text-align:right;font-size:14px;font-weight:900;color:#1A3C2F;">₹${amount.toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Meta info -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF8F5;border-radius:16px;border:1px solid #E8E2D9;overflow:hidden;">
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid #E8E2D9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Order ID</td>
                    <td style="font-size:12px;font-weight:600;color:#1A3C2F;text-align:right;font-family:monospace;">${orderId.slice(0, 20)}...</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;border-bottom:1px solid #E8E2D9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Purchase Date</td>
                    <td style="font-size:12px;font-weight:600;color:#1A3C2F;text-align:right;">${date}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:11px;font-weight:700;color:#5C6B60;text-transform:uppercase;letter-spacing:1px;">Billed To</td>
                    <td style="font-size:12px;font-weight:600;color:#1A3C2F;text-align:right;">${email}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      ${divider()}
      
      <!-- License Key -->
      <tr>
        <td style="padding:32px 48px;">
          <h2 style="font-size:11px;font-weight:800;color:#5C6B60;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Your License Key</h2>
          <div style="background:linear-gradient(135deg,#1A3C2F,#2D5741);border-radius:14px;padding:24px 28px;text-align:center;">
            <p style="font-size:11px;color:rgba(250,248,245,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Keep this safe — it is your proof of purchase</p>
            <p style="font-size:14px;font-weight:700;color:#C4A35A;font-family:'Courier New',monospace;letter-spacing:2px;word-break:break-all;">${licenseKey}</p>
          </div>
        </td>
      </tr>
      ${divider()}
      
      <!-- CTA -->
      <tr>
        <td style="padding:36px 48px;text-align:center;">
          <a href="https://creato4.com/dashboard" style="display:inline-block;background:linear-gradient(135deg,#1A3C2F,#2D6B52);color:#FAF8F5;font-size:13px;font-weight:800;text-decoration:none;padding:18px 48px;border-radius:50px;letter-spacing:1.5px;text-transform:uppercase;box-shadow:0 8px 24px rgba(26,60,47,0.3);">Access Your Downloads →</a>
          <p style="margin-top:16px;font-size:11px;color:#5C6B60;">All your purchases are safely stored in your dashboard</p>
        </td>
      </tr>
    </table>
  `;
  return emailWrapper(content, `Your order for ${productName} is confirmed. Access your files now.`);
}

// ============================================================
// 4. PASSWORD RESET EMAIL
// ============================================================
export function getPasswordResetEmail({ name, resetUrl }: { name: string; resetUrl: string }): string {
  const content = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:56px 48px 36px;text-align:center;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#C4A35A,#D4B870);border-radius:20px;margin:0 auto 24px;font-size:34px;line-height:72px;text-align:center;">🔑</div>
          <h1 style="font-size:26px;font-weight:900;color:#1A3C2F;margin-bottom:12px;letter-spacing:-0.3px;">Reset Your Password</h1>
          <p style="font-size:14px;color:#5C6B60;max-width:400px;margin:0 auto;line-height:1.7;">Hi <strong style="color:#1A3C2F;">${name}</strong>, click the button below to reset your password. This link is valid for <strong>1 hour</strong> only.</p>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:36px 48px;text-align:center;">
          <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#C4A35A,#D4B870);color:#1A3C2F;font-size:13px;font-weight:900;text-decoration:none;padding:18px 48px;border-radius:50px;letter-spacing:1.5px;text-transform:uppercase;">Reset My Password →</a>
        </td>
      </tr>
      ${divider()}
      <tr>
        <td style="padding:24px 48px;background:#FFF8F8;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="font-size:16px;padding-right:10px;">🛡️</td>
              <td>
                <p style="font-size:12px;color:#5C6B60;line-height:1.6;">If you didn't request this, ignore this email. Your account is safe and no changes have been made. Never share this link with anyone.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr><td style="height:48px;"></td></tr>
    </table>
  `;
  return emailWrapper(content, `Reset your Creato4 Lab password — link expires in 1 hour.`);
}
