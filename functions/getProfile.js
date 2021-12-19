module.exports = async (bot, db, memberID) => {
  if (!db) throw new Error("Не указана база данных для поиска.");
  var users = db.collection("users");
  if (!memberID) throw new Error("Не указан айди пользователя для поиска.");
  var data = await users
    .find({
      login: memberID.id || memberID,
    })
    .toArray();
  var member = data[0] || {};

  class ProfileGet {
    constructor(bot, db, member, memberID) {
      this.member = member;
      this.coins = this.member.coins || 0;
      this.data = this.member;
    }

    getData() {
      return this.member || {};
    }

    getBalance() {
      return this.coins || 0;
    }

    async setBalance(amount) {
      amount = Number(amount);
      if (isNaN(amount)) throw new Error("Баланс не является числом.");
      if (amount < 0)
        throw new Error(
          "Неправильно указан новый баланс. Значение не должно быть меньше 0."
        );
      this._updateData({
        coins: amount,
      });
      this.member.coins = amount;
      return {
        action: "Balance Set",
        balance: {
          before: this.getBalance(),
          after: amount,
        },
      };
    }

    async addMoney(amount) {
      amount = Number(amount);
      if (isNaN(amount)) throw new Error("Сумма не является числом.");
      if (amount < 0) throw new Error("Сумма должна быть больше нуля.");

      let balance = this.getBalance();
      var result = amount + balance;

      if (isNaN(result))
        throw new Error("Результат операции не является числом.");
      if (result < 0) result = balance;
      this.updateData({
        coins: result,
      });
      this.coins += amount;
      return {
        action: "Add Money",
        balance: {
          before: balance,
          after: result,
        },
      };
    }

    async removeMoney(amount) {
      amount = Number(amount);
      if (isNaN(amount)) throw new Error("Сумма не является числом.");
      if (amount < 0) throw new Error("Сумма должна быть больше нуля.");

      let balance = this.getBalance();
      var result = balance - amount;
      console.log(result);
      if (isNaN(result) || result < 0)
        throw new Error("Неправильный результат операции.");
      if (result < 0) result = balance;
      this.updateData({
        coins: result,
      });
      this.coins = result;
      return {
        action: "Remove Money",
        balance: {
          before: balance,
          after: result,
        },
      };
    }

    async updateData(data) {
      if (!this.member.login) {
        data.login = memberID;
        users.insertOne(data);
      } else {
        users.updateOne(
          {
            login: memberID,
          },
          {
            $set: data,
          }
        );
      }

      var newProfile = await users
        .find({
          login: memberID,
        })
        .toArray();
      this.member = newProfile[0];
    }
  }

  var Profile = new ProfileGet(bot, db, member, memberID);
  return Profile;
};
