const nodemailer = require('nodemailer');

// ── Transporter (Gmail + App Password) ───────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Shared styles ─────────────────────────────────────────────
const STYLES = {
  body:    'margin:0;padding:0;background:#141414;font-family:Arial,sans-serif;color:#ffffff;',
  wrap:    'max-width:600px;margin:0 auto;background:#1a1a1a;border-radius:8px;overflow:hidden;',
  header:  'background:#E50914;padding:24px 32px;text-align:center;',
  logo:    'font-size:28px;font-weight:900;color:#ffffff;letter-spacing:2px;margin:0;',
  tagline: 'font-size:12px;color:rgba(255,255,255,0.8);margin:4px 0 0;letter-spacing:1px;',
  body_p:  'padding:32px;',
  h2:      'color:#F5C518;font-size:22px;margin:0 0 16px;',
  p:       'color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 12px;',
  card:    'background:#252525;border-radius:6px;padding:20px;margin:20px 0;border-left:4px solid #E50914;',
  row:     'display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #333;',
  label:   'color:#888888;font-size:13px;',
  value:   'color:#ffffff;font-size:13px;font-weight:bold;',
  btn:     'display:inline-block;background:#E50914;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:4px;font-size:15px;font-weight:bold;margin:20px 0;',
  footer:  'padding:20px 32px;text-align:center;border-top:1px solid #333;',
  ftxt:    'color:#666;font-size:12px;margin:0;',
  gold:    'color:#F5C518;',
};

function infoRow(label, value) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #333;color:#888;font-size:13px;width:40%;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #333;color:#fff;font-size:13px;font-weight:bold;">${value}</td>
    </tr>`;
}

// ── FUNCTION 1: Booking Confirmation ─────────────────────────
async function sendBookingConfirmation(booking) {
  if (!booking.email || booking.email === 'N/A') return;

  const movieTitle    = booking.movie?.title   || 'Movie';
  const cinema        = booking.showtime?.cinema || 'DrukCinema';
  const hall          = booking.showtime?.hall   || '';
  const showDate      = booking.showtime?.date
    ? new Date(booking.showtime.date).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
    : 'N/A';
  const showTime      = booking.showtime?.time  || 'N/A';
  const seatsList     = Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats;
  const total         = `Nu. ${booking.totalAmount || booking.amount}`;
  const convFee       = `Nu. ${booking.convenienceFee || 0}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${STYLES.body}">
  <div style="${STYLES.wrap}">

    <!-- Header -->
    <div style="${STYLES.header}">
      <h1 style="${STYLES.logo}">🎬 DRUK CINEMA</h1>
      <p style="${STYLES.tagline}">BHUTAN'S PREMIER CINEMA EXPERIENCE</p>
    </div>

    <!-- Body -->
    <div style="${STYLES.body_p}">
      <h2 style="${STYLES.h2}">✅ Booking Confirmed!</h2>
      <p style="${STYLES.p}">Hi ${booking.customerName || 'there'},<br>
      Your booking is confirmed. Here are your details:</p>

      <!-- Booking card -->
      <div style="${STYLES.card}">
        <p style="margin:0 0 12px;color:#F5C518;font-size:16px;font-weight:bold;">${movieTitle}</p>
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow('Booking ID',    `<span style="${STYLES.gold}">${booking.bookingId}</span>`)}
          ${infoRow('Cinema',        `${cinema}${hall ? ' · ' + hall : ''}`)}
          ${infoRow('Date',          showDate)}
          ${infoRow('Time',          showTime)}
          ${infoRow('Seats',         seatsList)}
          ${infoRow('Seat Type',     booking.seatType ? booking.seatType.charAt(0).toUpperCase() + booking.seatType.slice(1) : 'Classic')}
          ${infoRow('Subtotal',      `Nu. ${booking.amount}`)}
          ${infoRow('Convenience Fee', convFee)}
          ${infoRow('Total Paid',    `<span style="color:#F5C518;font-size:15px;">${total}</span>`)}
        </table>
      </div>

      <p style="${STYLES.p}">Please arrive <strong>15 minutes early</strong> and bring this booking ID to the counter.</p>
      <p style="${STYLES.p}" style="color:#888;font-size:13px;">📍 Thimphu, Bhutan &nbsp;|&nbsp; 📞 +975-17-CINEMA</p>
    </div>

    <!-- Footer -->
    <div style="${STYLES.footer}">
      <p style="${STYLES.ftxt}">© 2024 DrukCinema · Thimphu, Bhutan</p>
      <p style="${STYLES.ftxt}">This is an automated confirmation email. Please do not reply.</p>
    </div>

  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from:    `"DrukCinema 🎬" <${process.env.EMAIL_USER}>`,
      to:      booking.email,
      subject: `✅ Booking Confirmed — ${movieTitle} [${booking.bookingId}]`,
      html,
    });
    console.log(`[Email] Booking confirmation sent → ${booking.email}`);
  } catch (err) {
    console.error('[Email] Booking confirmation failed:', err.message);
  }
}

// ── FUNCTION 2: Password Reset ────────────────────────────────
async function sendPasswordResetEmail(email, name, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL || 'https://drukcinema.vercel.app'}/reset-password.html?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${STYLES.body}">
  <div style="${STYLES.wrap}">

    <!-- Header -->
    <div style="${STYLES.header}">
      <h1 style="${STYLES.logo}">🎬 DRUK CINEMA</h1>
      <p style="${STYLES.tagline}">BHUTAN'S PREMIER CINEMA EXPERIENCE</p>
    </div>

    <!-- Body -->
    <div style="${STYLES.body_p}">
      <h2 style="${STYLES.h2}">🔐 Reset Your Password</h2>
      <p style="${STYLES.p}">Hi ${name || 'there'},</p>
      <p style="${STYLES.p}">We received a request to reset your password for your DrukCinema account. Click the button below to set a new password:</p>

      <div style="text-align:center;">
        <a href="${resetUrl}" style="${STYLES.btn}">Reset Password</a>
      </div>

      <div style="${STYLES.card}">
        <p style="margin:0;color:#888;font-size:13px;">⏰ This link expires in <strong style="color:#F5C518;">1 hour</strong>.</p>
        <p style="margin:8px 0 0;color:#888;font-size:13px;">🔒 If you did not request this, please ignore this email — your account is safe.</p>
      </div>

      <p style="${STYLES.p}">Or copy this link into your browser:</p>
      <p style="word-break:break-all;color:#E50914;font-size:12px;">${resetUrl}</p>
    </div>

    <!-- Footer -->
    <div style="${STYLES.footer}">
      <p style="${STYLES.ftxt}">© 2024 DrukCinema · Thimphu, Bhutan</p>
      <p style="${STYLES.ftxt}">This link will expire in 1 hour for security reasons.</p>
    </div>

  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from:    `"DrukCinema 🎬" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: '🔐 Reset Your DrukCinema Password',
      html,
    });
    console.log(`[Email] Password reset sent → ${email}`);
  } catch (err) {
    console.error('[Email] Password reset failed:', err.message);
    throw err; // re-throw so route can respond 500
  }
}

// ── FUNCTION 3: Welcome Email ─────────────────────────────────
async function sendWelcomeEmail(email, name) {
  const firstName = name ? name.split(' ')[0] : 'there';

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="${STYLES.body}">
  <div style="${STYLES.wrap}">

    <!-- Header -->
    <div style="${STYLES.header}">
      <h1 style="${STYLES.logo}">🎬 DRUK CINEMA</h1>
      <p style="${STYLES.tagline}">BHUTAN'S PREMIER CINEMA EXPERIENCE</p>
    </div>

    <!-- Body -->
    <div style="${STYLES.body_p}">
      <h2 style="${STYLES.h2}">🎉 Welcome to DrukCinema!</h2>
      <p style="${STYLES.p}">Hi ${firstName},</p>
      <p style="${STYLES.p}">Welcome to Bhutan's premier cinema experience! Your account has been created successfully.</p>

      <div style="${STYLES.card}">
        <p style="margin:0 0 8px;color:#F5C518;font-weight:bold;">What you can do now:</p>
        <p style="margin:0 0 6px;color:#ccc;font-size:14px;">🎟️ &nbsp;Book tickets for the latest Bhutanese & international films</p>
        <p style="margin:0 0 6px;color:#ccc;font-size:14px;">📋 &nbsp;View and manage your booking history in your profile</p>
        <p style="margin:0 0 6px;color:#ccc;font-size:14px;">🔔 &nbsp;Get notified when new movies arrive</p>
        <p style="margin:0;color:#ccc;font-size:14px;">💺 &nbsp;Choose your favourite seats online</p>
      </div>

      <div style="text-align:center;">
        <a href="${process.env.FRONTEND_URL || 'https://drukcinema.vercel.app'}/movies.html" style="${STYLES.btn}">Browse Movies</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="${STYLES.footer}">
      <p style="${STYLES.ftxt}">© 2024 DrukCinema · Thimphu, Bhutan</p>
      <p style="${STYLES.ftxt}">You're receiving this because you created an account at DrukCinema.</p>
    </div>

  </div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from:    `"DrukCinema 🎬" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: '🎉 Welcome to DrukCinema — Bhutan\'s Premier Cinema!',
      html,
    });
    console.log(`[Email] Welcome email sent → ${email}`);
  } catch (err) {
    console.error('[Email] Welcome email failed:', err.message);
    // don't throw — registration should succeed even if welcome email fails
  }
}

module.exports = { sendBookingConfirmation, sendPasswordResetEmail, sendWelcomeEmail };
