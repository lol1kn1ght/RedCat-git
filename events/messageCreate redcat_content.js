const talkedRecently = new Set();
const fetch = require('node-fetch')
const { cookie } = require('../config/cookie_future.json');

class Event {
    constructor() { }

    async execute(bot, mongo, message) {

        const { author, channel, member, guild, attachments } = message

        if (channel.type === "dm") return;

        if (!["581181840832987176"].includes(guild.id)) return


        if (["647370289193287680", "652764653281083417"].includes(channel.id)) { // авто"поделиться" с #видео и #новости
            if (channel.type === "GUILD_NEWS") {
                if (member.roles.cache.some(role => "652455460632395776" || "445572229351211018")) return
                message.crosspost()
                    .then(() => {
                        const logs = new Discord.MessageEmbed()
                            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
                            .setDescription(`Сообщение в <#${channel.id}> опубликовано.\n\n[__**--> Ссылка на сообщение <--**__](https://discord.com/channels/581181840832987176/${channel.id}/${message.id})`)
                            .setColor(Discord.Colors.Green)
                            .setTimestamp()

                        bot.channels.cache.get('813676322286993429').send({ embeds: [logs] })
                    })
                    .catch(console.error);
            }
        }

        if (["620255074022588416"].includes(channel.id)) { // авто"поделиться" с #дейлики информация
            if (channel.type === "GUILD_NEWS") {
                message.crosspost()
                    .then(() => {
                        const logs = new Discord.MessageEmbed()
                            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
                            .setDescription(`Сообщение в <#${channel.id}> опубликовано.\n\n[__**--> Ссылка на сообщение <--**__](https://discord.com/channels/581181840832987176/${channel.id}/${message.id})`)
                            .setColor(Discord.Colors.Green)
                            .setTimestamp()

                        bot.channels.cache.get('813676322286993429').send({ embeds: [logs] })
                    })
                    .catch(console.error);
            }
        }

        if ([
            "732215865965281331", // создание веток в мемы
            "817242006363045908", // скриншоты рдр
            "603189971192381450", // скриншоты другие игры
            "656096784451633153", // розовые пантеры
            "786496505481003008", // видео другие игры
            "611422533664899102", // видео рдр
            "879647297573617685", // myfood
        ].includes(channel.id)) {
            if (author.bot) return;

            let sucsess = false;

            async function createThread() {
                await message.startThread({
                    name: 'Обсуждение',
                    autoArchiveDuration: 60 * 24
                }).then(async (msg) => {
                    await msg.members.remove(author.id)
                    msg.send(`создано`)
                })
            }

            function ValidURL(str) {
                let regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                if (!regex.test(str)) {
                    return false;
                } else {
                    return true;
                }
            }

            if (ValidURL(message.content)) sucsess = true
            if (attachments.size > 0) sucsess = true

            if (sucsess) {
                createThread()
            } else {
                if (['652455460632395776', '582260552588460053'].some(id => member.roles.cache.get(id))) return
                if (author.bot) return;
                await message.delete().catch(err => { })
            }
        }

        let masreact = guild.emojis.cache.map((x) => x)

        let RandReact = masreact[Math.floor(Math.random() * (masreact.length))];

        let random = Math.floor(Math.random() * 300);
        if (channel.id === "603205650440388618") {
            if (random === 42) { // Если вычислено число 42, то выпадает будет лайк.
                message.react(RandReact).catch((err) => { `❌ Ошибка добавления реакции. Пользователь занес меня в чс.\n- **\`хейтор.\`**` })
            }
        }

        if (attachments.size > 0) { // реакции чат пантер
            if (attachments.every(attachIsImage)) {
                //something
            }
            function attachIsImage(msgAttach) {
                let url = msgAttach.url;
                //True if this url is a png image.
                return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
            }
            if (channel.id === "656096784451633153") {
                if (author.bot) return;
                message.react("<:RDR_pantera:821599392787464202>");
            }
        }

        const nazar = ["назар"];
        const not_trigger_nazar = [
            "582260552588460053", "648818757409701890", // модератор, шериф
            "689152822805266495", "689152822805266495", // сенатор, спец по железу
            "666318100458766383", "798048924710862868", // кланы: акатсуки, блекдамбас
            "670272083468746752", "785455233416429568", // FFH, прайд
            "683954872818597894", "768801378960801803", // мерценари, олдсинерс
            "672132743471169537", // славяне
            "656096171391057920", "655824669710221351", // розовая пантера, индеец
            "869414145617965066", "666318041813876742", // главный критик, критик
            "620254077346906144", "586137047270686740", // исследователь, чемпион
            "600305710299086859", "582454877461020702" // креативный, старожил
        ]

        for (let i = 0; i < nazar.length; i++) {
            if (author.bot) return;
            let content = message.content.toLowerCase(); // .toLowerCase - делает похуй на регистр букв
            if (content.includes(nazar[i])) {
                if (["632878917207719986", "582506192287301632", "632887039905366016", "621348242566676490", "627928404221624323"].includes(channel.id)) { // рдо, дейлики, вопрос-ответ, коллеционер //22 тест
                    if (not_trigger_nazar.some(id => member.roles.cache.get(id))) return

                    if (talkedRecently.has(author.id)) return
                    talkedRecently.add(author.id);

                    let nazar_mas = [
                        `https://cdn.discordapp.com/attachments/603189971192381450/911607363054731304/Red_Dead_Redemption_2_Screenshot_2021.11.18_-_19.49.45.29.png`,
                        `https://cdn.discordapp.com/attachments/627928404221624323/991615853630083122/unknown.png`
                    ]
                    let nazar_nazar = nazar_mas[Math.floor(Math.random() * (nazar_mas.length))];

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Я вижу...вы, ${member.displayName}, что-то ищете...`)
                        .setDescription('\nЧтобы найти мадам Назар, пропишите в канале <#809480946561974312> команду \`/nazar\` или пройдите в канал <#620255074022588416>, там наши исследователи каждый день выкладывают ее актуальное местоположение!')
                        .setColor(message.guild.me.displayHexColor)
                        .setImage(nazar_nazar)
                        .setTimestamp()
                    message.reply({
                        embeds: [embed],
                        allowedMentions: { repliedUser: false }
                    })


                    setTimeout(() => {
                        talkedRecently.delete(author.id);
                    }, 1200000);

                }
            }
        }

        const hachu = ["хачю"];
        for (let i = 0; i < hachu.length; i++) {
            let content = message.content.toLowerCase().split(' ');
            if (author.bot) return;
            if (content.includes(hachu[i])) {
                message.reply({
                    content: `❌ Перехочешь.`,
                    allowedMentions: { repliedUser: false }
                });
            }
        }

        const ustala = ["устал"];
        if (["603205650440388618"].includes(channel.id)) {
            let content = message.content.toLowerCase().split(' ');
            for (let i = 0; i < ustala.length; i++) {
                if (author.bot) return;
                if (content.includes(ustala[i])) {
                    message.reply({
                        content: `Cтареешь по чуть-чуть))`,
                        allowedMentions: { repliedUser: false }
                    });
                }
            }
        }


        const dobroeutro1 = ["доброго утр", "добрым утр", "утричка добр"]; // Добрые утрички
        for (let i = 0; i < dobroeutro1.length; i++) {
            let content = message.content.toLowerCase();
            if (author.bot) return;
            if (content.includes(dobroeutro1[i])) {
                if (["603205650440388618"].includes(channel.id)) {

                    if (talkedRecently.has(author.id)) return
                    talkedRecently.add(author.id);

                    const cat_api = await fetch("https://api.thecatapi.com/v1/images/search?mime_types=gif", {
                        PARAMS: {
                            limit: `1`
                        }
                    }).then(async (x) => await x.json())

                    let embed;
                    if (author.id === "665111167441698826") { // если Лёха

                        const cookie_rand = cookie[Math.floor(Math.random() * (cookie.length))]

                        message.react("💞")

                        embed = new Discord.MessageEmbed()
                            .setTitle(`${cookie_rand}`)
                            .setColor(message.guild.me.displayHexColor)
                            .setImage(`${cat_api[0].url}`)
                            .setTimestamp()
                    } else {

                        embed = new Discord.MessageEmbed()
                            .setTitle(`И тебе доброго утра, от кота! <a:cat_cute:840074770337759282>`)
                            .setColor(message.guild.me.displayHexColor)
                            .setImage(`${cat_api[0].url}`)
                            .setTimestamp()
                    }

                    message.reply({
                        embeds: [embed],
                        allowedMentions: { repliedUser: false }
                    })

                    setTimeout(() => {
                        talkedRecently.delete(author.id);
                    }, 43200000);

                }
            }
        }

        if (channel.id === "846569943021387816") { // Рандомно кому-то котов в #чат котов
            if (author.bot) return;

            let m_channel = message.channel
            let m_member = member
            let content = message.content.slice(0, 1950) + (message.content.length > 1950 ? " ..." : "")

            await message.delete().catch(err => { message.channel.send(`Я сломалась - несите другую...`) })

            let db = await mongo.db("581181840832987176").collection("cats_chats")
            let channel = await db.findOne({ "channel": m_channel.id })
            let number = channel.number
            let new_number = number + 1

            const cat_chat = [`${new_number}`];

            let cat_url;
            async function catApi_1() {
                const cat_api = await fetch(`https://some-random-api.ml/img/cat`)
                    .then(async (x) => await x.json())

                return cat_url = cat_api.link
            }

            async function catApi_2() {
                const cat_api = await fetch("https://api.thecatapi.com/v1/images/search?mime_types=gif?limit=1")
                    .then(async (x) => await x.json())
                return cat_url = cat_api[0].url
            }

            const random_cat = (Math.floor(Math.random() * 2) + 1)

            if (random_cat === 1) await catApi_1()
            if (random_cat === 2) await catApi_2()

            if (!content) return
            for (let i = 0; i < cat_chat.length; i++) {
                if (content.includes(cat_chat[i])) {

                    const embed = new Discord.MessageEmbed()
                        .setDescription(`${content}`)
                        .setColor(m_member.displayHexColor)
                        .setImage(cat_url)

                    const webhooks = await m_channel.fetchWebhooks();
                    const webhook = webhooks.find(wh => wh.token) ?? await m_channel.createWebhook(`${m_channel.name}`)

                    await webhook.send({
                        embeds: [embed],
                        username: `${m_member.displayName}`,
                        avatarURL: m_member.displayAvatarURL({ format: 'png' })
                    })

                    await db.updateOne({ "channel": m_channel.id }, { "$set": { "number": new_number } })

                    let random = Math.floor(Math.random() * 100);
                    if (random === 53) { // Если вычислено число 17, то выпадает будут начислены коты в чате котов.

                        let userdb = await mongo.db("581181840832987176").collection("users")
                        let profile = await userdb.findOne({ "login": m_member.id })
                        if (!profile) {
                            await userdb.insertOne({ "login": m_member.id, "coins": 0 })
                            profile = await userdb.findOne({ "login": m_member.id })
                        }
                        let balance = await profile.coins;
                        if (!balance) {
                            await userdb.updateOne({ "login": m_member.id }, { "$inc": { "coins": 0 } })
                            balance = 0
                        }

                        let updbalance = balance + 250
                        await userdb.updateOne({ "login": m_member.id }, { "$set": { "coins": updbalance } })

                        const cat_win = new Discord.MessageEmbed()
                            .setTitle(`Вам улыбнулась удача!`)
                            .setDescription(`Начислено: +250 <:r_cat_dollar:875295128045097001>`)
                            .setColor(m_member.displayHexColor)

                        await webhook.send({
                            embeds: [cat_win],
                            username: `${m_member.displayName}`,
                            avatarURL: m_member.displayAvatarURL({ format: 'png' })
                        })

                        const logs = new Discord.MessageEmbed()
                            .setAuthor({ name: m_member.displayName, iconURL: m_member.displayAvatarURL() })
                            .setTitle(`Пользователь получил котов!`)
                            .setDescription(`В чате: <#846569943021387816>\n**User ID:** \`${m_member.id}\`\n${m_member}\n**Был баланс:** \`${balance}\`\n**Текущий баланс:** \`${updbalance}\``)
                            .setColor(Discord.Colors.Green)
                            .setTimestamp()

                        bot.channels.cache.get('654719623371161620').send({ embeds: [logs] })
                    }
                }
            }
        }

        const glitch = ["глитч"];
        let content = message.content.toLowerCase().split(' ');
        for (let i = 0; i < glitch.length; i++) {
            if (author.bot) return;
            if (content.includes(glitch[i])) {
                if (["632878917207719986", "582506192287301632",
                    "632887039905366016", "623140607296012318",
                    "621348242566676490", "623140559480946688",
                    "655005316320198656", "736274242114682930",
                    "641616732565405696", "788265057837645834",
                    "604161437077733397", "603189971192381450",
                    "611422533664899102", "603205650440388618"].includes(channel.id)) {
                    if (talkedRecently.has(author.id)) return
                    talkedRecently.add(author.id);
                    message.reply({
                        content: `За обсуждение глитчей тут могут и забанить))`,
                        allowedMentions: { repliedUser: false }
                    })
                    setTimeout(() => {
                        talkedRecently.delete(author.id);
                    }, 43200000);
                }
            }
        }

    }

}
module.exports = (...args) => {
	  new Event().execute(...args);
};
