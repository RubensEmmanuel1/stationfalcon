const {
  Client,
  GatewayIntentBits,
  Events,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');
require('dotenv').config();

// Variáveis de ambiente
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// Inicializando o bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Comandos Slash
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com pong!')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Adicione o bot ao seu servidor!')
    .toJSON()
];

// Registro dos comandos
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('⏳ Registrando comandos slash...');

    // Comandos globais (demoram a aparecer)
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('✅ Comandos globais registrados!');

    // Comandos locais (aparecem instantaneamente)
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('✅ Comandos locais registrados para testes!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();

// Evento: Bot pronto
client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);

  // Mensagens rotativas de status
  const statusList = [
    { name: '⚙️ | Configurando comandos slash...', type: 0 }, // 0 = Jogando, 1 = Transmitindo, 2 = Ouvindo, 3 = Assistindo, 5 = Competindo
    { name: '❗ | Meu prefixo é !', type: 0 }
  ];

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      status: 'online', // opções: 'online', 'idle', 'dnd', 'invisible'
      activities: [statusList[i]]
    });
    i = (i + 1) % statusList.length;
  }, 5000); // troca a cada 15 segundos
});

// Comandos de texto (!comando)
client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;

  const msg = message.content.toLowerCase();

  if (msg === '!ping') {
    message.reply('🏓 Pong!');
  }

  else if (msg === '!oi') {
    message.reply(`Olá, ${message.author.username}!`);
  }

  else if (msg === '!plataform') {
    const embed = new EmbedBuilder()
      .setColor('#5562ee')
      .setTitle('Para finalizar, qual é a sua plataforma?')
      .setDescription(`> - 📱 Mobile\n> - 🖥️ PC\n> - 🎮 Console`);
    message.channel.send({ embeds: [embed] });
  }

  else if (msg === '!rules') {
    const embed = new EmbedBuilder()
      .setColor('#5562ee')
      .setDescription(`:scroll: **Regras do servidor**

👋 **Bem-vindo ao nosso cantinho!**

Esse servidor é entre amigos, então vamos manter o clima leve e divertido. Mas algumas regrinhas ajudam tudo a ficar melhor:

🤝・**Respeito sempre**  
Zoar faz parte, mas sem passar do limite. Nada de ofensas pesadas, preconceito ou tretas desnecessárias.

🚫・**Sem flood ou spam**  
Evite mandar a mesma coisa mil vezes, exagerar nos emojis ou links desnecessários.

🔞・**Conteúdo pesado? Não aqui.**  
Sem NSFW ou conteúdo violento.

📣・**Divulgação com bom senso**  
Quer divulgar algo? Fale com os administradores.

📂・**Use os canais certos**  
Facilita a organização.

💬・**Debates? Ok. Briga? Não.**  
Todo mundo aqui é amigo.

🚫・**Preconceito ZERO**  
Racismo, machismo, homofobia = fora!

💻・**Nada ilegal**  
Sem pirataria ou golpes.

🔔・**Sem ser chato, ok?**  
Sem spam, insistência ou incômodo.

🛡️・**Moderadores estão aí pra ajudar**  
Qualquer coisa, chame um <@&1380392523431940168>.`);
    message.channel.send({ embeds: [embed] });
  }

  else if (msg === '!line') {
    message.channel.send('https://cdn.discordapp.com/attachments/1380395208532824247/1380450681822908456/image.png');
  }

  else if (msg === '!invite') {
    const embed = new EmbedBuilder()
      .setColor('#5562ee')
      .setTitle('Me adicione ao seu servidor!')
      .setImage('https://cdn.discordapp.com/attachments/1355760755877613578/1380465342328999976/bot_banner2.jpg')
      .setDescription('https://discord.com/oauth2/authorize?client_id=1380406549050032138&scope=bot%20applications.commands&permissions=0');
    message.reply({ embeds: [embed] });
  }
});

// Comandos Slash (via "/")
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('🏓 Pong (via slash command)!');
  }

  else if (commandName === 'invite') {
    const embed = new EmbedBuilder()
      .setColor('#5562ee')
      .setTitle('Me adicione ao seu servidor!')
      .setImage('https://cdn.discordapp.com/attachments/1355760755877613578/1380465342328999976/bot_banner2.jpg')
      .setDescription('https://discord.com/oauth2/authorize?client_id=1380406549050032138&scope=bot%20applications.commands&permissions=0');
    await interaction.reply({ embeds: [embed] });
  }
});

// Login do bot
client.login(token);