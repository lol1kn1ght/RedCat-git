module.exports = async function (db, userID, itemId, amount) {
  try {
    var users = db.collection(`users`);

    let data = await users
      .find({
        login: userID,
      })
      .toArray();
    var user = data[0];
    if (!amount) amount = 1;
    if (isNaN(itemId)) throw new Error(`Не указан айди предмета.`);
    var inventory = user.inventory;
    if (!inventory) return;

    var spliceItem = inventory.filter((val) => val.id === itemId)[0];
    if (!spliceItem) return;
    var itemPlace = inventory.indexOf(spliceItem);
    if (spliceItem.amount - amount <= 0) {
      inventory.splice(itemPlace, 1);
      users.updateOne(
        {
          login: userID,
        },
        {
          $set: {
            inventory: inventory,
          },
        }
      );
    } else {
      spliceItem.amount = spliceItem.amount - amount;
      inventory[itemPlace] = spliceItem;
      users.updateOne(
        {
          login: userID,
        },
        {
          $set: {
            inventory: inventory,
          },
        }
      );
    }
  } catch (e) {
    return e.message;
  }
};
