import { throwIfMissing, sendPushNotification } from './utils.js';

export default async ({ req, res, log, error }) => {
  throwIfMissing(process.env, [
    'FCM_PROJECT_ID',
    'FCM_PRIVATE_KEY',
    'FCM_CLIENT_EMAIL',
    'FCM_DATABASE_URL',
  ]);

  try {
    throwIfMissing(req.body, ['deviceToken', 'message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  log(`Sending message to device: ${req.body.deviceToken}`);
  log(`Message title: ${req.body.message.title}`);
  log(`Message body: ${req.body.message.body}`);
  log(`data payload: ${req.body.data}`,);
  try {
    const response = await sendPushNotification({
      notification: {
        title: req.body.message.title,
        body: req.body.message.body
      },
      // extra options payload here
      data: req.body.data ?? {},
      token: req.body.deviceToken,
    });


    log(`Successfully sent message: ${response}`);


    return res.json({ ok: true, messageId: response });
  } catch (e) {
    error(e);
    return res.json({ ok: false, error: `failed due to ${e}` }, 500);
  }
};
