import { SlashCommandBuilder } from 'discord.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import config from '../config.json' with { type: 'json' };


const guardOptions = [
    { name: 'Kanal Koruması', value: 'channelProtection', emojiId: '1352628245505511498' },
    { name: 'Rol Koruması', value: 'roleProtection', emojiId: '1352628245505511498' },
    { name: 'Sticker Koruması', value: 'stickerProtection', emojiId: '1352628245505511498' },
    { name: 'Sunucu Koruması', value: 'serverProtection', emojiId: '1352628245505511498' },
    { name: 'Webhook Koruması', value: 'webhookProtection', emojiId: '1352628245505511498' },
    { name: 'Tarayıcı Giriş Koruması', value: 'browserLoginProtection', emojiId: '1352628245505511498' },
    { name: 'Offline Yetkili Koruması', value: 'offlineAdminProtection', emojiId: '1352628245505511498' },
];

export default {
    data: new SlashCommandBuilder()
        .setName('guardsetup')
        .setDescription('Koruma seçeneklerini ayarlayın.'),
    async execute(interaction) {
        const optionsRow = new MessageActionRow();

        guardOptions.forEach(option => {
            const emoji = interaction.client.emojis.cache.get(option.emojiId);
            optionsRow.addComponents(
                new MessageButton()
                    .setCustomId(option.value)
                    .setLabel(`${option.name} ${emoji ? emoji : ''}`)
                    .setStyle('PRIMARY')
            );
        });

        await interaction.reply({
            content: 'Koruma seçeneklerini seçin:',
            components: [optionsRow],
            ephemeral: true,
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId) {
                const protectionStatus = i.customId;
                await i.reply({ content: `${protectionStatus} durumu değiştirildi!`, ephemeral: true });

                
                try {
                    switch (protectionStatus) {
                        case 'channelProtection':
                            await enableChannelProtection(interaction.guild);
                            break;
                        case 'roleProtection':
                            await enableRoleProtection(interaction.guild);
                            break;
                        case 'stickerProtection':
                            await enableStickerProtection(interaction.guild);
                            break;
                        case 'serverProtection':
                            await enableServerProtection(interaction.guild);
                            break;
                        case 'webhookProtection':
                            await enableWebhookProtection(interaction.guild);
                            break;
                        case 'browserLoginProtection':
                            await enableBrowserLoginProtection(interaction.guild);
                            break;
                        case 'offlineAdminProtection':
                            await enableOfflineAdminProtection(interaction.guild);
                            break;
                    }
                } catch (error) {
                    console.error(`Koruma hatası: ${error.message}`);
                    await i.reply({ content: 'Koruma ayarı yapılırken bir hata oluştu.', ephemeral: true });
                }
            }
        });

        collector.on('end', collected => {
            interaction.followUp({ content: 'Koruma ayarları süresi doldu.', ephemeral: true });
        });
    },
};


async function enableChannelProtection(guild) {
    console.log('Kanal koruması etkinleştirildi.');
    const channels = await guild.channels.fetch();
    const whitelist = config.whitelist || []; 

    channels.forEach(channel => {
        if (channel.type === 'GUILD_TEXT') {
            channel.permissionOverwrites.edit(guild.roles.everyone, {
                SEND_MESSAGES: false,
            }).then(() => {
                console.log(`Kanal koruması ${channel.name} için etkinleştirildi.`);
            }).catch(console.error);
        }
    });
}

async function enableRoleProtection(guild) {
    console.log('Rol koruması etkinleştirildi.');
    const roles = await guild.roles.fetch();
    const whitelist = config.whitelist || []; 

    roles.forEach(role => {
        if (role.name !== '@everyone') {
            role.setPermissions(0).then(() => {
                console.log(`Rol koruması ${role.name} için etkinleştirildi.`);
            }).catch(console.error);
        }
    });
}

async function enableStickerProtection(guild) {
    console.log('Sticker koruması etkinleştirildi.');
    const stickers = await guild.stickers.fetch();
    const whitelist = config.whitelist || []; 
    stickers.forEach(sticker => {
        sticker.delete().then(() => {
            console.log(`Sticker koruması ${sticker.name} için etkinleştirildi.`);
        }).catch(console.error);
    });
}

async function enableServerProtection(guild) {
    console.log('Sunucu koruması etkinleştirildi.');
    const whitelist = config.whitelist || []; 
    guild.members.fetch().then(members => {
        members.forEach(member => {
            if (!member.user.bot && !whitelist.includes(member.user.id)) {
                member.kick('Sunucu koruması nedeniyle atıldı.').then(() => {
                    console.log(`${member.user.tag} sunucudan atıldı.`);
                }).catch(console.error);
            }
        });
    });
}

async function enableWebhookProtection(guild) {
    console.log('Webhook koruması etkinleştirildi.');
    const webhooks = await guild.fetchWebhooks();
    const whitelist = config.whitelist || []; 

    webhooks.forEach(webhook => {
        webhook.delete().then(() => {
            console.log(`Webhook koruması ${webhook.name} için etkinleştirildi.`);
        }).catch(console.error);
    });
}

async function enableBrowserLoginProtection(guild) {
    console.log('Tarayıcı giriş koruması etkinleştirildi.');
    
}

async function enableOfflineAdminProtection(guild) {
    console.log('Offline yetkili koruması etkinleştirildi.');
    const offlineAdmins = guild.members.cache.filter(member => member.presence.status === 'offline' && member.permissions.has('ADMINISTRATOR'));
    const whitelist = config.whitelist || []; 
    offlineAdmins.forEach(admin => {
        if (!whitelist.includes(admin.user.id)) {
            admin.kick('Offline yetkili koruması nedeniyle atıldı.').then(() => {
                console.log(`${admin.user.tag} offline yetkili olarak atıldı.`);
            }).catch(console.error);
        }
    });
}
