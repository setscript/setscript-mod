// commands/admin/spoofer.js

import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    data: new SlashCommandBuilder()
        .setName('Sunucu')
        .setDescription('Sunucu güncellemelerini duyurur')
        .addStringOption(option =>
            option.setName('Güncelleme')
                .setDescription('Hangi oyun için spoofer güncellemesi yapılacak?')
                .setRequired(true)
                .addChoices(
                    { name: 'Sunucu', value: 'Minecraft' },
                )
        )
        .addStringOption(option =>
            option.setName('admin_notu')
                .setDescription('Admin notu ekleyin (isteğe bağlı)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const oyun = interaction.options.getString('oyun');
            const adminNotu = interaction.options.getString('admin_notu');
            const bildirimKanali = '1341467754288381975'; // bildirmleri atacagı kanalın idsini girceksin
            
            
            const resimYolu = path.join(__dirname, '..', '..', 'resimler', `${oyun}.png`);
            
           
            if (!fs.existsSync(resimYolu)) {
                return await interaction.reply({
                    content: 'Bu oyun için resim dosyası bulunamadı!',
                    ephemeral: true
                });
            }

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${oyun.toUpperCase()} Sunucu Güncellemesi`)
                .setDescription(`${oyun.charAt(0).toUpperCase() + oyun.slice(1)} Sunucu güncellendi.\n\nYeni Güncellemeler hakkında <#1341461134238290067> kanalından bilgi alabilirsiniz.\nVip alımları için ticket açmanız gerekir Ticket Kanalı <#1341461134582091782> .`)
                .setImage(`attachment://${oyun}.png`)
                .setTimestamp();

            
            if (adminNotu) {
                embed.setFooter({ text: `Admin Notu: ${adminNotu}` });
            }

           
            const channel = await interaction.client.channels.fetch(bildirimKanali);
            await channel.send({
                embeds: [embed],
                files: [resimYolu]
            });

            
            await interaction.reply({
                content: 'Sunucu güncellemesi başarıyla duyuruldu!',
                ephemeral: true
            });

        } catch (error) {
            console.error('Sunucu komutunda hata:', error);
            await interaction.reply({
                content: 'Bir hata oluştu! Lütfen daha sonra tekrar deneyin.',
                ephemeral: true
            });
        }
    },
};
