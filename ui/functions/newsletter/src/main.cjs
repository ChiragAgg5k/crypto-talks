const sdk = require('node-appwrite');
const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');
const querystring = require('node:querystring');
const staticFolder = path.join(__dirname, '../static');

const resend = new Resend(process.env.RESEND_API_KEY);

const ErrorCode = {
  INVALID_REQUEST: 'invalid-request',
  MISSING_FORM_FIELDS: 'missing-form-fields',
  SERVER_ERROR: 'server-error',
};

function urlWithCodeParam(baseUrl, codeParam) {
  const url = new URL(baseUrl);
  url.searchParams.set('code', codeParam);
  return url.toString();
}

function getStaticFile(fileName) {
  return fs.readFileSync(path.join(staticFolder, fileName)).toString();
}

module.exports = async function ({ req, res, log, error }) {
  if (!process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === '*') {
    log(
      'WARNING: Allowing requests from any origin - this is a security risk!'
    );
  }

  if (req.method === 'GET' && req.path === '/') {
    return res.text(getStaticFile('index.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }

  if (req.headers['content-type'] !== 'application/x-www-form-urlencoded') {
    error('Incorrect content type.');
    return res.redirect(
      urlWithCodeParam(req.headers['referer'], ErrorCode.INVALID_REQUEST)
    );
  }

  const form = querystring.parse(req.body);

  if (form['password'] !== process.env.PASSWORD) {
    error('Invalid password.');
    return res.redirect(
      urlWithCodeParam(req.headers['referer'], ErrorCode.INVALID_REQUEST)
    );
  }

  const client = new sdk.Client();
  const database = new sdk.Databases(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  try {
    const subscribers = await database.listDocuments(
      'crypto_portfolio',
      'subscribers',
      [sdk.Query.isNotNull('subscribed_at')]
    );
    const newsletterContent = {
      subject: 'Your Monthly Newsletter',
      html: '<h1>Welcome to our Newsletter!</h1><p>Here are the latest updates...</p>',
    };

    const emailPromises = subscribers.documents.map((subscriber) => {
      const data = {
        from: 'Crypto Talks <crypto@chiragaggarwal.tech>',
        to: [subscriber.email],
        subject: newsletterContent.subject,
        html: newsletterContent.html,
      };

      return resend.emails.send(data);
    });

    await Promise.all(emailPromises);

    return res.text(getStaticFile('success.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  } catch (error) {
    console.log(error);
    return res.redirect(
      urlWithCodeParam(req.headers['referer'], ErrorCode.SERVER_ERROR)
    );
  }
};
