module.exports = async function(db, club, itemId, amount = 1) {
  try {
    var clubs_db = db.collection(`clubs`);

    if (!itemId && isNaN(Number(amount)))
      throw new Error(`Не указан айди предмета.`);
    var inventory = club.inventory;
    if (!inventory) return;

    var spliceItem = inventory.filter(val => val.id === itemId)[0];
    if (!spliceItem) return;
    var itemPlace = inventory.indexOf(spliceItem);
    if (spliceItem.amount - 1 <= 0) {
      inventory.splice(itemPlace, 1);
      users.updateOne(
        {
          owner: club.owner
        },
        {
          $set: {
            inventory: inventory
          }
        }
      );
    } else {
      spliceItem.amount = spliceItem.amount - 1;
      inventory[itemPlace] = spliceItem;
      users.updateOne(
        {
          owner: club.owner
        },
        {
          $set: {
            inventory: inventory
          }
        }
      );
    }
  } catch (e) {
    return e.message;
  }
};
