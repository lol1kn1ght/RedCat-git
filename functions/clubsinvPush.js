module.exports = exports = async function(db, club, itemId, amount = 1) {
  try {
    var clubs_db = db.collection(`clubs`);
    var shop = db.collection(`clubs_shop`);
    let itemsData = await shop.find().toArray();
    var shopItem = itemsData.filter(val => val.id === Number(itemId))[0];
    if (!shopItem) throw new Error(`Указан несуществующий айди предмета.`);

    var inventory = club.inventory || [];

    var item = inventory.filter(val => val.id === itemId)[0];
    if (item) {
      var inventoryPlace = inventory.indexOf(item);
      item.amount = item.amount + amount;
      inventory[inventoryPlace] = item;
      clubs_db.updateOne(
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
      inventory.push({
        id: itemId,
        amount: amount
      });
      clubs_db.updateOne(
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
    /*
        {
        id: itemID,
        amount: amount,
        strength: itemStrength
        }
        */
  } catch (e) {
    return console.log(e);
  }
};
