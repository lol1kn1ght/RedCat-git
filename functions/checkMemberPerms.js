/**
 * @param {object} member - Объект мембера, права доступа которого нужно проверить.
 * @param {object} message - Сообщение команды для которого нужно сделать проверку
 * @param {string} type - Тип вызванной команды
 * @param {array|object} permissions_input - Массив с объектами прав доступа из команды.
 */

function checkMemberPerms(member, message, type, ...permissions_input) {
  const Discord = new require("discord.js");
  if (!member || !permissions_input || !permissions_input[0])
    throw new Error("Один из параметров не указан / указан неверно.");

  let allow_channel = true,
    allow_permissions = true,
    allow_roles = false;

  let channels_perms =
    permissions_input.filter(permission => permission["channels"])[0]
      .channels || [];

  let allowed_roles =
    permissions_input.filter(permission => permission["roles"])[0].roles || [];

  let permissions_member =
    permissions_input.filter(permission => permission["permissions"])[0]
      .permissions || [];

  if (
    !channels_perms.includes(message.channel.id) &&
    type !== "Модерация" &&
    !channels_perms.includes("EVERYWHERE")
  )
    allow_channel = false;

  if (permissions_member[0]) {
    if (permissions_member.includes("OWNER")) {
      if (member.id !== f.config.owner) return allow_permissions;
    }
    if (!member.permissions.has(permissions_member)) allow_permissions = false;
  }

  if (allowed_roles[0]) {
    if (
      member.roles.cache.filter(role => allowed_roles.includes(role.id)).first()
    )
      allow_roles = true;
  }
  if (
    type === "WIP" &&
    !member.permissions.has("ADMINISTRATOR") &&
    member.id !== f.config.owner
  )
    return false;
  if (allow_channel) {
    if (allow_permissions || allow_roles) return true;
  }
}

module.exports = checkMemberPerms;
