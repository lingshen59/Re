const { Client, GatewayIntentBits, PermissionsBitField, REST, Routes, SlashCommandBuilder } = require('discord.js');

// === CONFIGURA ESTO ===
const TOKEN = 'TU_TOKEN_DEL_BOT';
const CLIENT_ID = 'TU_CLIENT_ID';

// === REGISTRAR COMANDO SLASH ===
const commands = [
  new SlashCommandBuilder()
    .setName('borrar_todo')
    .setDescription('Elimina todos los canales y categorías del servidor.')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registrando comando...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('Comando registrado correctamente.');
  } catch (error) {
    console.error('Error al registrar comando:', error);
  }
})();

// === INICIAR BOT ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'borrar_todo') {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: 'No tienes permisos suficientes.', ephemeral: true });
    }

    await interaction.reply('Eliminando todos los canales y categorías...');

    const channels = interaction.guild.channels.cache;
    for (const [id, channel] of channels) {
      try {
        await channel.delete();
        console.log(`Eliminado: ${channel.name}`);
      } catch (err) {
        console.error(`No se pudo eliminar ${channel.name}:`, err);
      }
    }
  }
});

client.login(TOKEN);
