module.exports = exports = async function (
  db,
  userID,
  itemId,
  amount,
  itemStrength
) {
  try {
    var users = db.collection(`users`);
    var shop = db.collection(`shop`);
    shop.find().toArray((err, itemsData) => {
      var shopItem = itemsData.filter((val) => val.id === itemId)[0];
      if (!shopItem) throw new Error(`Указан несуществующий айди предмета.`);
      users
        .find({
          login: userID,
        })
        .toArray(async (err, data) => {
          var user = data[0];
          var inventory = user.inventory;
          if (!inventory) inventory = [];
          if (!amount) amount = 1;
          if (!itemStrength) itemStrength = shopItem.strength;
          var item = inventory.filter((val) => val.id === itemId)[0];
          if (item) {
            var inventoryPlace = inventory.indexOf(item);
            item.amount = item.amount + amount;
            inventory[inventoryPlace] = item;
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
            inventory.push({
              id: itemId,
              amount: amount,
              strength: itemStrength,
            });
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
          /*
        {
        id: itemID,
        amount: amount,
        strength: itemStrength
        }
        */
        });
    });
  } catch (e) {
    return console.log(e);
  }
};
