import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));

export default {
    data: new SlashCommandBuilder()
        .setName('kayit-kur')
        .setDescription('Minecraft sunucusu kayıt sistemini kurar')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            
            const welcomeImage = new AttachmentBuilder(
                path.join(__dirname, '../../resimler/welcome.png'),
                { name: 'welcome.png' }
            );

            const rulesEmbed = new EmbedBuilder()
                .setTitle('🎮 Minecraft Sunucusu Kuralları')
                .setDescription(`
                    **Önemli Kurallarımız:**
**Sunucu Kuralları**:

**Saygılı Olun**
**Tüm üyeler birbirine saygılı olmalıdır. Hakaret, küfür veya aşağılayıcı dil kullanmak kesinlikle yasaktır.**

       :White_Okey: **Tartışmalar ve Anlaşmazlıklar**
       **Fikir ayrılıkları olabilir, ancak tartışmalarınızı yaparken nezaket kurallarına uyun. Kişisel saldırılardan ve provokasyonlardan kaçının.**

       :White_Okey: **Spam ve Reklam Yasaktır**
       **Sunucuda spam yapmak, aşırı emoji kullanımı, gereksiz mesajlar atmak veya izinsiz reklam yapmak yasaktır.**

        :White_Okey:**Uygunsuz İçerik Paylaşımı Yasaktır**
       **Şiddet, cinsellik, nefret söylemi veya yasa dışı içeriklerin paylaşılması yasaktır. Bu tür içerikler anında silinir ve gerekli önlemler alınır.**

        :White_Okey: **Kanalları Doğru Kullanın**
       **Her kanalın belirli bir amacı vardır. Lütfen konuşmalarınızı, paylaşımlarınızı ve içeriklerinizi doğru kanallarda yapın.**

       **Kullanıcı Bilgilerini Paylaşmayın**
       **Kişisel bilgilerinizi veya başkalarının bilgilerini paylaşmak yasaktır. Sunucudaki güvenliği ve gizliliği korumak herkesin sorumluluğudur.**

        :White_Okey: **Bot Kullanımı**
       **Bot komutları sadece belirli kanallarda kullanılabilir. Lütfen gereksiz bot komutlarıyla sunucuyu tıkanmayın.**

        :White_Okey: **Yasa Dışı Faaliyetler**
    **Yasa dışı etkinlikler veya illegal ürünlerin ticareti kesinlikle yasaktır.**

        :White_Okey: **Sesli Sohbet Kuralları**
      **Sesli kanallarda yüksek sesle bağırmak, müzik açmak veya spam yapmak yasaktır. Lütfen diğer üyeleri rahatsız etmeyin.**

        :White_Okey: **Yönetimle İletişim**
      **Herhangi bir sorununuz veya öneriniz varsa, yönetim ekibiyle özelden iletişime geçebilirsiniz. Tüm üyeler eşit şekilde saygı görmelidir.**

      :White_Okey:   **Kuralları Kabul Etme:**
      **Bu kurallara uymak, sunucuya katılmak için zorunludur.**
      **Kuralları kabul etmediğiniz takdirde, sunucuya giriş yapamazsınız.**
      **Kuralların ihlali durumunda, uyarılar ve gerektiğinde kalıcı yasaklamalar uygulanacaktır.**
                    

                    ✅ Kuralları kabul ediyorsanız aşağıdaki butona tıklayın.
                `)
                .setColor('#FF0000')
                .setImage('attachment://welcome.png')
                .setFooter({ 
                    text: '© 2025 Gezgin Network | Tüm Hakları Saklıdır', 
                    iconURL: interaction.guild.iconURL() 
                })
                .setTimestamp();

            const acceptButton = new ButtonBuilder()
                .setCustomId('accept_rules')
                .setLabel('Kuralları Kabul Ediyorum')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅');

            const row = new ActionRowBuilder()
                .addComponents(acceptButton);

            await interaction.channel.send({
                embeds: [rulesEmbed],
                files: [welcomeImage],
                components: [row]
            });

            await interaction.reply({
                content: 'Kayıt sistemi başarıyla kuruldu!',
                ephemeral: true
            });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Bir hata oluştu! Hata: ' + error.message,
                ephemeral: true
            });
        }
    },
};
