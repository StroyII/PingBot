import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const isDev = process.env.NODE_ENV === "development";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Déclaration des commandes
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond Pong!"),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Vérifie si le bot est en ligne"),
].map(cmd => cmd.toJSON());

// Enregistrement des commandes sur le serveur
const rest = new REST({ version: "10" }).setToken(token);
(async () => {
    try {
    console.log("Déploiement des commandes");

    // Choix entre déploiement local ou global
    if (isDev) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
        console.log("✅ Commandes déployées en mode DEV (serveur unique)");
    } else {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("🌍 Commandes déployées globalement");
    }
  } catch (err) {
    console.error(err);
  }
})();

// Réponse aux commandes
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong !");
  }

  if (interaction.commandName === "status") {
    const uptime = Math.floor(client.uptime / 1000);
    await interaction.reply(`✅ Je suis en ligne depuis ${uptime} secondes !`);
  }
});

client.once("ready", () => {
  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

client.login(token);
