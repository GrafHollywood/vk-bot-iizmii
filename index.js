const dotenv = require('dotenv');
const { VK } = require('vk-io');

dotenv.config();

const vk = new VK({
  token: process.env.TOKEN,
});

vk.updates.use((context, next) => {
  if (context.is(['message']) && context.isOutbox) {
    return;
  }
  return next();
});

vk.updates.on('message', async (context) => {
  const [user] = await vk.api.users.get({ user_id: context.senderId });
  context.send(
    `Hello, ${user.first_name} ${user.last_name}
	Ты написал мне '${context.text}'`
  );
});

vk.updates.start().catch(console.error);
