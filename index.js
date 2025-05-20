require('dotenv').config(); // Cargar variables del .env

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

// Cuando el bot recibe el comando !borrar_todo
client.on('messageCreate', async (message) => {
  if (message.content === '!borrar_todo' && message.member.permissions.has('Administrator')) {
    try {
      const channels = message.guild.channels.cache;
      for (const [id, channel] of channels) {
        await channel.delete().catch(console.error);
      }
      console.log('Todos los canales han sido eliminados.');
    } catch (err) {
      console.error('Error eliminando canales:', err);
    }
  }
});

client.login(process.env.TOKEN);
