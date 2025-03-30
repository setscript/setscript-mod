// commands/admin/sunucuicikural.js

import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('sunucuicikural')
        .setDescription('Sunucu kurallarına Göz Atmayı unutmayın Sunucuya girerken kuralları kabul etmiş sayılırsınız.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Kurallara Git')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.com/channels/1341461133571391568/1341461134238290066')
            );

        
        await interaction.deferReply({ ephemeral: true });
        
        
        await interaction.channel.send({
            embeds: [{
                color: 0x0099ff,
                title: '📜 Sunucu Kuralları',
                description: 'Sunucu kurallarımızı okumak için aşağıdaki butona tıklayabilirsiniz.'
            }],
            components: [row]
        });

        
        await interaction.deleteReply();
    },
};
