const {MessageActionRow, MessageButton} = require("discord.js");

class Command {
  constructor() {
    this.options = this.#getOptions();
    this.slashOptions = this.#getSlashOptions();
  }

  async execute(bot, message, args, mongo) {
    let db = mongo.db(message.guild.id);
    let users_db = db.collection("users");

    // const rolesrow2 = new MessageActionRow().addComponents(
    //   new MessageButton()
    //     .setStyle("SECONDARY")
    //     .setLabel("ПК")
    //     .setEmoji("<:pl_PC:631939178044719104>")
    //     .setCustomId("626800044884099082"),
    //
    //   new MessageButton()
    //     .setStyle("SUCCESS")
    //     .setLabel("XBOX")
    //     .setEmoji("<:pl_xbox:627947917432455178>")
    //     .setCustomId("598163957081178126"),
    //
    //   new MessageButton()
    //     .setStyle("PRIMARY")
    //     .setLabel("PlayStation")
    //     .setEmoji("<:pl_ps:627947891192758322>")
    //     .setCustomId("598164183586177064"),
    //
    // );
    //
    // let msg = await bot.channels.cache
    //   .get("652521261058228236")
    //   .messages.fetch("817434947119611925");
    //
    // msg.edit({
    //   components: [rolesrow2]
    // });

    f.club_day_income = {};
  }

  #getOptions() {
    return {
      aliases: "test",
      description: "test",
      enabled: true,
      type: "WIP",
      permissions: [`OWNER`],
      allowedChannels: [`EVERYWHERE`],
      allowedRoles: []
    };
  }

  #getSlashOptions() {
    return {
      name: "test",
      description: this.options.description
    };
  }
}
module.exports = Command;
