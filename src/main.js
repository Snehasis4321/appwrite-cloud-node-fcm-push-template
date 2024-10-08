import { throwIfMissing, sendPushNotification,sendNotificationToMany } from './utils.js';

export default async ({ req, res, log, error }) => {
  try {
    throwIfMissing(req.body, ['deviceToken', 'message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  try {
    if(req.path=="/"){
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
    }
    if(req.path=="/many"){
      // here the device token should be [] of device tokens.
      const response = await sendNotificationToMany({
        notification: {
          title: req.body.message.title,
          body: req.body.message.body
        },
        // extra options payload here
        data: req.body.data ?? {},
        tokens: req.body.deviceToken,
      });
      
      
      log(`Successfully sent message: ${response}`);
      
      
      return res.json({ ok: true, messageId: response });
    }

  } catch (e) {
    error(e);
    return res.json({ ok: false, error: `failed due to ${e}` }, 500);
  }
};
