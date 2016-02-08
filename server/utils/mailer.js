'use strict';

const apiKey = process.env.MAILGUN_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const from = process.env.MAILGUN_FROM;
const mailgun = require('mailgun-js')({ apiKey, domain });

class Mailer {
  constructor(message) {
    this.mailData = {
      from: from,
      to: `${message.category}@smashingboxes.com`,
      subject: `New contact message from the website! [${message.category}]`,
      text: message.formatted()
    };
  }

  send() {
    return mailgun.messages().send(this.mailData);
  }
}

module.exports = Mailer;
