var f = {
  config: require("./config.json"),
  discharge: require(`../functions/numDischarge.js`),
  checkMemberPerms: require("../functions/checkMemberPerms"),
  msToTime: require("../functions/msToTime"),
  parse_duration: require("parse-duration"),
  pages_menu: require("../functions/pagesMenu"),
  club_day_income: {},
  Profile: require("../functions/getProfile"),
  push_item: require("../functions/itemPush"),
  splice_item: require("../functions/spliceItem"),
  economy_logs: require("../functions/economyLogs"),
  club_push_item: require("../functions/clubsinvPush"),
  club_inv_splice: require("../functions/clubsinvSplice"),
  clubEconomy_logs: require("../functions/clubEconomyLogs"),
  day_income: {},
  unb_token: require("./constants.json").unb_token,
  msg: async function(msg, text, options) {
    var Discord = require("discord.js");
    var embed = new Discord.MessageEmbed()
      .setAuthor(
        msg.author.tag,
        msg.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setDescription(text)
      .setTimestamp()
      .setColor(this.config.color);

    if (options) embed = Object.assign(embed, options);
    return msg.channel.send({embeds: [embed]});
  },
  msgFalse: async function(msg, text, options) {
    var Discord = require("discord.js");
    var embed = new Discord.MessageEmbed()
      .setAuthor(
        msg.author.tag,
        msg.author.displayAvatarURL({
          dynamic: true
        })
      )
      .setDescription(text)
      .setTimestamp()
      .setColor(this.config.colorFalse);

    if (options) embed = Object.assign(embed, options);
    return msg.channel.send({embeds: [embed]});
  }
};

f.config.prefix = require("./constants.json").prefix;

f.currency = f.config.currencyIcon;
module.exports = f;
