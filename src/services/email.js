async function sendOrderConfirmation(order) {
  // TODO: Configure nodemailer with SMTP
  console.log(`[EMAIL] Order confirmation would be sent to ${order.customer_email}`);
}

async function sendStoryEmail(email, storyTitle, pdfBuffer) {
  // TODO: Send PDF attachment
  console.log(`[EMAIL] Story "${storyTitle}" would be sent to ${email}`);
}

module.exports = { sendOrderConfirmation, sendStoryEmail };
