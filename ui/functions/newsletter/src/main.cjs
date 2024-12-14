const sdk = require('node-appwrite');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

module.exports = async function (req, res) {
  if (!req || !res) {
    throw new Error('Request and response objects are required');
  }

  if (req.method === 'GET') {
    return res.json({
      status: 'OK',
      message: 'Newsletter function is up and running',
    });
  }

  const client = new sdk.Client();
  const database = new sdk.Databases(client);

  client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });

  try {
    const subscribers = await database.listDocuments(
      'crypto_portfolio',
      'subscribers',
      [sdk.Query.equal('subscribed', true)]
    );

    const newsletterContent = {
      subject: 'Your Monthly Newsletter',
      html: '<h1>Welcome to our Newsletter!</h1><p>Here are the latest updates...</p>',
    };

    const emailPromises = subscribers.documents.map((subscriber) => {
      const data = {
        from: req.variables['SENDER_EMAIL'],
        to: subscriber.email,
        subject: newsletterContent.subject,
        html: newsletterContent.html,
      };
      return mg.messages.create('smtp.mailgun.org', data);
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.documents.length} subscribers.`,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Failed to send newsletter',
      error: error.message,
    });
  }
};
