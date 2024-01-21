class Event {
    constructor() { }

    async execute(bot, mongo, message) {

        if (message.guild === null) return;

        if (!["581181840832987176"].includes(message.guild.id)) return

        const sopr = ["сопровождение"];
        if (message.channel.id === "806815816804335636") { // проверка на чат клана
            if (message.member.roles.cache.some(role => role.id === "785455233416429568")) { //проверка на роль клана
                if (message.member.roles.cache.some(role => role.id === "842087886697398342")) { //доп проверка на игровую роль
                    const exampleEmbed2 = new Discord.MessageEmbed()
                        .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL() })
                        .setTitle(`Уважаемый(ая), хочет подарить бабло и теплое общение - ПОГНАЛИ!`)
                        .setColor('#ff6b18')
                        .setImage('https://cdn.discordapp.com/attachments/886363503756214322/891785942636040242/buggy-horse-and-buggy.gif')
                    let content = message.content.toLowerCase().split(' ');
                    for (let i = 0; i < sopr.length; i++) {
                        if (content.includes(sopr[i])) {
                            message.channel.send({ content: `<@&842087886697398342>`, embeds: [exampleEmbed2] });
                            break
                        }
                    }
                }
            }
        }

        const car = ["царь"]; // Триггер
        if (message.channel.id === "806815816804335636") { // проверка на чат клана
            if (message.member.roles.cache.some(role => role.id === "785455233416429568")) {//проверка на роль клана
                const exampleEmbed3 = new Discord.MessageEmbed()
                    .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL() })
                    .setTitle(`Я вызываю батю, батюню, атца !!!`)
                    .setColor('#ff6b18')
                    .setImage('https://cdn.discordapp.com/attachments/627928404221624323/836893776403234826/tenor_11.gif')
                let content = message.content.toLowerCase().split(' ');
                for (let i = 0; i < car.length; i++) {
                    if (content.includes(car[i])) {
                        message.channel.send({ content: `<@!445572229351211018>`, embeds: [exampleEmbed3] });
                        break
                    }
                }
            }
        }


        const vander = ["вандер"]; // Триггер
        if (message.channel.id === "806815816804335636") { // проверка на чат клана
            if (message.member.roles.cache.some(role => role.id === "785455233416429568")) {//проверка на роль клана
                const exampleEmbed5 = new Discord.MessageEmbed()
                    .setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL() })
                    .setTitle(`Иди сюда, я желаю тебя видеть!!`)
                    .setColor('#ff6b18')
                    .setImage('https://cdn.discordapp.com/attachments/806815816804335636/829996908721733632/tenor_7.gif')

                let content = message.content.toLowerCase().split(' ');
                for (let i = 0; i < vander.length; i++) {
                    if (content.includes(vander[i])) {
                        message.channel.send({ content: `<@!329966505229811713>`, embeds: [exampleEmbed5] });
                        break
                    }
                }
            }
        }


        const viki = ["вики"]; // Триггер
        if (message.channel.id === "806815816804335636") { // проверка на чат клана
            if (message.member.roles.cache.some(role => role.id === "785455233416429568")) {//проверка на роль клана
                const exampleEmbed6 = new Discord.MessageEmbed()
                    .setTitle(`Вики внимательно слушает, но это не точно...`)
                    .setColor('#ff6b18')
                    .setImage('https://cdn.discordapp.com/attachments/627928404221624323/905304214094364722/cute-cat.gif')
                let content = message.content.toLowerCase().split(' ');
                for (let i = 0; i < viki.length; i++) {
                    if (content.includes(viki[i])) {
                        message.channel.send({ content: `<@!690445504978616331>`, embeds: [exampleEmbed6] });
                        break
                    }
                }
            }
        }

    }

}
module.exports = (...args) => {
	  new Event().execute(...args);
};
