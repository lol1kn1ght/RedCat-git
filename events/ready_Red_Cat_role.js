class Event {
  constructor() {}

  async execute(client, message, ready) {
    if (interaction.customId == "PC") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "626800044884099082"
        )
      ) {
        await interaction.member.roles
          .remove("626800044884099082")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&626800044884099082>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("626800044884099082")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&626800044884099082>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
    if (interaction.customId == "XBOX") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "598163957081178126"
        )
      ) {
        await interaction.member.roles
          .remove("598163957081178126")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&598163957081178126>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("598163957081178126")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&598163957081178126>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
    if (interaction.customId == "PS") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "598164183586177064"
        )
      ) {
        await interaction.member.roles
          .remove("598164183586177064")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&598164183586177064>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("598164183586177064")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&598164183586177064>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }

    if (interaction.customId == "drgames") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "763080675548332082"
        )
      ) {
        await interaction.member.roles
          .remove("763080675548332082")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&763080675548332082>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("763080675548332082")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&763080675548332082>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
    if (interaction.customId == "poiskgames") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "724513678149550161"
        )
      ) {
        await interaction.member.roles
          .remove("724513678149550161")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&724513678149550161>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("724513678149550161")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&724513678149550161>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
    if (interaction.customId == "poiskohot") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "746029718217818132"
        )
      ) {
        await interaction.member.roles
          .remove("746029718217818132")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&746029718217818132>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("746029718217818132")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&746029718217818132>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
    if (interaction.customId == "hachuverif") {
      if (
        interaction.member.roles.cache.some(
          role => role.id === "798422475905040445"
        )
      ) {
        await interaction.member.roles
          .remove("798422475905040445")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RDR_ban:821121198637056042> **Была удалена роль** <@&798422475905040445>')`,
            ephemeral: true
          })
          .catch(err => {});
      } else {
        await interaction.member.roles
          .add("798422475905040445")
          .catch(err => {});
        interaction
          .reply({
            content: `<:RCRsmall:627947952169680926> **Была выдана роль** <@&798422475905040445>')`,
            ephemeral: true
          })
          .catch(err => {});
      }
    }
  }
}
module.exports = (...args) => {
  new Event().execute(...args);
};
