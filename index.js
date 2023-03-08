const Discord = require("discord.js")

const config = require("./config.json")

const { MessageActionRow, MessageButton } = require('discord.js');

const client = new Discord.Client({ intents:[ Discord.GatewayIntentBits.Guilds ] });

const { QuickDB } = require("quick.db")

const db = new QuickDB()

module.exports = client

client.on('interactionCreate', (interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommand){

        const cmd = client.slashCommands.get(interaction.commandName);

    if (!cmd) return interaction.reply(`Error`);

        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction)
    }
})

client.on('ready', () => { console.log(`🔥 Estou online em ${client.user.username}!`) })


client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)

//////////////////////////////////////

client.on("interactionCreate", async(interaction) => {
    if (interaction.isButton()) {
      if (interaction.customId === "formulario") {
        if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
        const modal = new Discord.ModalBuilder()
        .setCustomId("modal")
        .setTitle("Faça Seu Registro.");
  
        const pergunta1 = new Discord.TextInputBuilder()
        .setCustomId("pergunta1") // Coloque o ID da pergunta
        .setLabel("Qual seu nome?") // Coloque a pergunta
        .setMaxLength(10) // Máximo de caracteres para a resposta
        .setMinLength(2) // Mínimo de caracteres para a respósta
        .setPlaceholder("Escreva seu nome do ``RP`` aqui!") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
  
        const pergunta2 = new Discord.TextInputBuilder()
        .setCustomId("pergunta2") // Coloque o ID da pergunta
        .setLabel("Qual seu sobrenome?") // Coloque a pergunta
        .setMaxLength(10) // Máximo de caracteres para a resposta
        .setMinLength(2) // Mínimo de caracteres para a respósta
        .setPlaceholder("Escreva seu sobrenome do ``RP`` aqui!") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
  
        const pergunta3 = new Discord.TextInputBuilder()
        .setCustomId("pergunta3") // Coloque o ID da pergunta
        .setLabel("Qual seu número?") // Coloque a pergunta
        .setMaxLength(7) // Máximo de caracteres para a resposta
        .setMinLength(7) // Mínimo de caracteres para a respósta
        .setPlaceholder("Escreva seu número do ``RP`` aqui!") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

        const pergunta4 = new Discord.TextInputBuilder()
        .setCustomId("pergunta4") // Coloque o ID da pergunta
        .setLabel("Qual seu passaporte?") // Coloque a pergunta
        .setMaxLength(6) // Máximo de caracteres para a resposta
        .setMinLength(1) // Mínimo de caracteres para a respósta
        .setPlaceholder("Escreva seu passaporte do ``RP`` aqui!") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)

        const pergunta5 = new Discord.TextInputBuilder()
        .setCustomId("pergunta5") // Coloque o ID da pergunta
        .setLabel("Quem te recrutou?") // Coloque a pergunta
        .setMaxLength(10) // Máximo de caracteres para a resposta
        .setMinLength(2) // Mínimo de caracteres para a respósta
        .setPlaceholder("Escreva o nome de quem te recrutou no ``RP`` aqui!") // Mensagem que fica antes de escrever a resposta
        .setRequired(true) // Deixar para responder obrigatório (true | false)
        .setStyle(Discord.TextInputStyle.Short) // Tipo de resposta (Short | Paragraph)
  
        modal.addComponents(
          new Discord.ActionRowBuilder().addComponents(pergunta1),
          new Discord.ActionRowBuilder().addComponents(pergunta2),
          new Discord.ActionRowBuilder().addComponents(pergunta3),
          new Discord.ActionRowBuilder().addComponents(pergunta4),
          new Discord.ActionRowBuilder().addComponents(pergunta5)
        )
  
        await interaction.showModal(modal)
      }
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "modal") {
        let resposta1 = interaction.fields.getTextInputValue("pergunta1")
        let resposta2 = interaction.fields.getTextInputValue("pergunta2")
        let resposta3 = interaction.fields.getTextInputValue("pergunta3")
        let resposta4 = interaction.fields.getTextInputValue("pergunta4")
        let resposta5 = interaction.fields.getTextInputValue("pergunta5")
  
        if (!resposta1) resposta1 = "Não informado."
        if (!resposta2) resposta2 = "Não informado."
        if (!resposta3) resposta3 = "Não informado."
        if (!resposta4) resposta4 = "Não informado."
        if (!resposta5) resposta5 = "Não informado."

       let confirmarRegistro = new Discord.EmbedBuilder()
       .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
       .setTitle('Confirmação de informações')
       .setDescription(`Olá ${interaction.user}, meu ping está em \`calculando...\`.`)
       .setColor("Random");

       interaction.reply({ 
        content: 'O formulário foi preenchido com sucesso! Por favor, confirme as informações abaixo:', 
        ephemeral: true, 
        embeds: [confirmarRegistro], 
        components: [
          new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId('confirmar')
              .setLabel('Confirmar')
              .setStyle('SUCCESS'),
            new MessageButton()
              .setCustomId('cancelar')
              .setLabel('Cancelar')
              .setStyle('DANGER')
          )
        ]
      });      

        const collector2 = interaction.channel.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, max: 1, time: 15000 });

        collector2.on('end', async (collected) => {
            if (collected.size === 0) {
              return interaction.followUp({ content: 'A confirmação expirou.', ephemeral: true });
            }
      
            const i = collected.first();
      
            if (i.customId === 'confirmar') {
              await interaction.followUp({ content: 'O formulário foi enviado com sucesso!', ephemeral: true });
  
        let embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`O usuário ${interaction.user} enviou o formulário abaixo:`)
        .addFields(
          {
            name: `Pergunta 1:`,
            value: `*Resposta 1:* \`${resposta1}\``,
            inline: false
          },
          {
            name: `Pergunta 2:`,
            value: `*Resposta 2:* \`${resposta2}\``,
            inline: false
          },
          {
            name: `Pergunta 3:`,
            value: `*Resposta 3:* \`${resposta3}\``,
            inline: false
          },
          {
            name: `Pergunta 4:`,
            value: `*Resposta 4:* \`${resposta4}\``,
            inline: false
          },
          {
            name: `Pergunta 5:`,
            value: `*Resposta 5:* \`${resposta5}\``,
            inline: false
          }
        );
  
        interaction.reply({ content: `Olá **${interaction.user.username}**, seu formulário foi enviado com sucesso!`, ephemeral: true})
        await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
      }
    })
    }
  }
})