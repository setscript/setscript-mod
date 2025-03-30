import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import { saveStats, loadStats } from '../utils/ticketUtils.js';
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
    name: 'interactionCreate',
    async execute(interaction) {
        
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Komut çalıştırılırken hata oluştu: ${error.message}`);

                const logChannelId = interaction.client.config?.logChannel;
                const logChannel = logChannelId ? interaction.guild.channels.cache.get(logChannelId) : null;

                if (logChannel) {
                    logChannel.send({
                        embeds: [{
                            color: 0xff0000,
                            title: '⚠️ Komut Hatası',
                            description: `**Komut:** \`${interaction.commandName}\`\n**Kullanıcı:** ${interaction.user.tag}\n\n\`\`\`${error.stack}\`\`\``
                        }]
                    }).catch(err => console.error(`Log kanalına hata mesajı atılamadı: ${err.message}`));
                }

                try {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
                    } else {
                        await interaction.reply({ content: 'Komutu çalıştırırken bir hata oluştu.', ephemeral: true });
                    }
                } catch (err) {
                    console.error(`Kullanıcıya hata mesajı gönderilemedi: ${err.message}`);
                }
            }
            return;
        }

        
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;

        
        if (interaction.customId === 'accept_rules') {
            try {
                const verifiedRoleId = config.registerSystem.verifiedRoleId;
                
                if (!verifiedRoleId) {
                    await interaction.reply({
                        content: 'Rol ID yapılandırması eksik!',
                        ephemeral: true
                    });
                    return;
                }

                await interaction.member.roles.add(verifiedRoleId);

                const registerButton = new ButtonBuilder()
                    .setCustomId('register')
                    .setLabel('Kayıt Ol')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(registerButton);

                await interaction.reply({
                    content: 'Kuralları kabul ettiniz! Şimdi kayıt olabilirsiniz.',
                    components: [row],
                    ephemeral: true
                });
                return;
            } catch (error) {
                console.error('Rol ekleme hatası:', error);
                await interaction.reply({
                    content: 'Rol eklenirken bir hata oluştu!',
                    ephemeral: true
                });
                return;
            }
        }

        if (interaction.customId === 'register') {
            try {
                const verifiedRoleId = config.registerSystem.verifiedRoleId;
                const memberRoleId = config.registerSystem.memberRoleId;

                if (!interaction.member.roles.cache.has(verifiedRoleId)) {
                    await interaction.reply({
                        content: '❌ Önce kuralları kabul etmelisiniz!',
                        ephemeral: true
                    });
                    return;
                }

                await interaction.member.roles.add(memberRoleId);

                await interaction.reply({
                    content: '✅ Başarıyla kayıt oldunuz!',
                    ephemeral: true
                });
                return;
            } catch (error) {
                console.error('Kayıt hatası:', error);
                await interaction.reply({
                    content: 'Kayıt sırasında bir hata oluştu!',
                    ephemeral: true
                });
                return;
            }
        }

        
        if (interaction.customId.startsWith('guard_')) {
            const protectionType = interaction.customId.split('_')[1];
            try {
                switch (protectionType) {
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
                await interaction.reply({ content: `${protectionType} durumu değiştirildi!`, ephemeral: true });
            } catch (error) {
                console.error(`${protectionType} hatası:`, error);
                await interaction.reply({ content: 'Koruma ayarı yapılırken bir hata oluştu.', ephemeral: true });
            }
            return;
        }

        
        const { logChannelId, categoryId, staffRoleId } = config.ticketSystem;

        try {
            if (interaction.customId === 'create_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('ticket_modal')
                    .setTitle('Ticket Oluştur');

                const reasonInput = new TextInputBuilder()
                    .setCustomId('ticket_reason')
                    .setLabel('Ticket açma sebebiniz nedir?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(new ActionRowBuilder().addComponents(reasonInput));
                await interaction.showModal(modal);
            }

            else if (interaction.customId === 'ticket_modal') {
                try {
                    const reason = interaction.fields.getTextInputValue('ticket_reason');
                    const guild = interaction.guild;
                    
                    const channel = await guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryId,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                            {
                                id: staffRoleId,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                        ],
                    });

                    const closeButton = new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Ticketi Kapat')
                        .setStyle(ButtonStyle.Danger);

                    const row = new ActionRowBuilder().addComponents(closeButton);

                    await channel.send({
                        content: `<@&${staffRoleId}> | <@${interaction.user.id}>`,
                        embeds: [{
                            title: 'Ticket Oluşturuldu',
                            description: `**Sebep:** ${reason}`,
                            color: 0x0099ff,
                        }],
                        components: [row]
                    });

                    const logChannel = await guild.channels.fetch(logChannelId);
                    await logChannel.send({
                        embeds: [{
                            title: 'Yeni Ticket Oluşturuldu',
                            description: `**Kullanıcı:** ${interaction.user.tag}\n**Sebep:** ${reason}`,
                            color: 0x00ff00,
                        }]
                    });

                    await interaction.reply({
                        content: `Ticket oluşturuldu! <#${channel.id}>`,
                        ephemeral: true
                    });
                } catch (error) {
                    console.error('Ticket oluşturma hatası:', error);
                    await interaction.reply({
                        content: 'Ticket oluşturulurken bir hata oluştu.',
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            else if (interaction.customId === 'close_ticket') {
                const modal = new ModalBuilder()
                    .setCustomId('close_ticket_modal')
                    .setTitle('Ticket Kapatma');

                const problemInput = new TextInputBuilder()
                    .setCustomId('problem_description')
                    .setLabel('Sorun neydi?')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const solvedInput = new TextInputBuilder()
                    .setCustomId('is_solved')
                    .setLabel('Sorun çözüldü mü? (evet/hayır)')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(problemInput),
                    new ActionRowBuilder().addComponents(solvedInput)
                );

                await interaction.showModal(modal);
            }

            else if (interaction.customId === 'close_ticket_modal') {
                try {
                    await interaction.reply({
                        content: 'Ticket kapatılıyor...',
                        ephemeral: true
                    });

                    const problem = interaction.fields.getTextInputValue('problem_description');
                    const isSolved = interaction.fields.getTextInputValue('is_solved').toLowerCase() === 'evet';

                    const stats = await loadStats();
                    if (!stats[interaction.user.id]) {
                        stats[interaction.user.id] = {
                            toplamTicket: 0,
                            cozulenTicket: 0,
                            cozulmeyen: 0
                        };
                    }

                    stats[interaction.user.id].toplamTicket++;
                    if (isSolved) {
                        stats[interaction.user.id].cozulenTicket++;
                    } else {
                        stats[interaction.user.id].cozulmeyen++;
                    }

                    await saveStats(stats);

                    const logChannel = await interaction.guild.channels.fetch(logChannelId);
                    await logChannel.send({
                        embeds: [{
                            title: 'Ticket Kapatıldı',
                            description: `**Yetkili:** ${interaction.user.tag}\n**Sorun:** ${problem}\n**Çözüldü mü:** ${isSolved ? '✅' : '❌'}`,
                            color: isSolved ? 0x00ff00 : 0xff0000,
                        }]
                    });

                    setTimeout(async () => {
                        await interaction.channel.delete().catch(console.error);
                    }, 1000);

                } catch (error) {
                    console.error('Ticket kapatma hatası:', error);
                    if (!interaction.replied) {
                        await interaction.reply({
                            content: 'Ticket kapatılırken bir hata oluştu.',
                            ephemeral: true
                        }).catch(() => {});
                    }
                }
            }
        } catch (error) {
            console.error('Ticket sistemi genel hatası:', error);
            try {
                if (!interaction.replied) {
                    await interaction.reply({
                        content: 'Bir hata oluştu.',
                        ephemeral: true
                    });
                }
            } catch (err) {
                console.error('Hata mesajı gönderilemedi:', err);
            }
        }
    },
};


async function enableChannelProtection(guild) {
    console.log('Kanal koruması etkinleştirildi.');
    const channels = await guild.channels.fetch();
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
    stickers.forEach(sticker => {
        sticker.delete().then(() => {
            console.log(`Sticker koruması ${sticker.name} için etkinleştirildi.`);
        }).catch(console.error);
    });
}

async function enableServerProtection(guild) {
    console.log('Sunucu koruması etkinleştirildi.');
    guild.members.fetch().then(members => {
        members.forEach(member => {
            if (!member.user.bot) {
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
    offlineAdmins.forEach(admin => {
        admin.kick('Offline yetkili koruması nedeniyle atıldı.').then(() => {
            console.log(`${admin.user.tag} offline yetkili olarak atıldı.`);
        }).catch(console.error);
    });
}
