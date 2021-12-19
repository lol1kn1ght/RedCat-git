module.exports = exports = async function (db, userID, itemId, amount) {
  try {
    var users = db.collection(`users`);
    var shop = db.collection(`shop`);
    let itemsData = await shop.find().toArray();
    var shopItem = itemsData.filter((val) => val.id === itemId)[0];
    if (!shopItem) throw new Error(`Указан несуществующий айди предмета.`);
    let data = await users
      .find({
        login: userID,
      })
      .toArray();
    var user = data[0] || {};
    var inventory = user.inventory;
    if (!inventory) inventory = [];
    if (!amount) amount = 1;
    var item = inventory.filter((val) => val.id === itemId)[0];
    if (item) {
      var inventoryPlace = inventory.indexOf(item);
      item.amount = item.amount + amount;
      inventory[inventoryPlace] = item;
      if (data[0]) {
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
        users.insertOne({
          login: userID,
          inventory: inventory,
        });
      }
    } else {
      inventory.push({
        id: itemId,
        amount: amount,
      });
      if (data[0]) {
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
        users.insertOne({
          login: userID,
          inventory: inventory,
        });
      }
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
