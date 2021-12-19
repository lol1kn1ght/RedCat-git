class ClubGet {
  constructor(bot, db, club) {
    this.club = club;
    this.guild = bot.guilds.cache.get(db.namespace);
  }

  getData() {
    return this.club
  }

  getBalance() {
    return this.club.coins || 0
  }

  setBalance(num) {
    var amount = Number(num)
    if (isNaN(amount)) throw new Error('Amount is not a number [Club:setBalance]')
    if (amount < 0) throw new Error(`Amount can't be lower then 0.`)

    this.updateData({
      coins: amount
    })
    return {
      action: 'Balance set',
      balance: {
        before: balance,
        after: sum
      }
    }
  }

  addMoney() {
    var amount = Number(num)
    if (isNaN(amount)) throw new Error('Amount is not a number [Club:addMoney]')
    if (amount < 0) throw new Error(`Amount can't be lower than 0.`)

    var balance = this.getBalance()
    var sum = balance + amount

    this.updateData({
      coins: sum
    })

    return {
      action: 'Add money',
      balance: {
        before: balance,
        after: sum
      }
    }
  }

  removeMoney() {
    var amount = Number(num)
    if (isNaN(amount)) throw new Error('Amount is not a number [Club:removeMoney]')
    if (amount < 0) throw new Error(`Amount can't be less than 0.`)

    var balance = this.getBalance()
    if (balance < amount) throw new Error(`Amount can't be more than balance [Club:removeMoney]`)
    var sum = balance - amount

    this.updateData({
      coins: sum
    })
    return {
      action: 'Remove money',
      balance: {
        before: balance,
        after: sum
      }
    }
  }

  getRequests() {
    return this.club.requests || []
  }

  getRequestsFull() {
    var arr = this.club.requests
    if (!arr || !arr[0]) return []

    var newArr = []

    for (var id of arr) {
      var member = this.guild.members.cache.get(id)
      if (!member) arr.splice(arr.indexOf(id), 1)
      else newArr.push(member)
    }

    this.updateData({
      requests: arr
    })

    return newArr
  }

  getMembers() {
    return this.club.members
  }

  getMembersFull() {
    var arr = this.club.members
    if (!arr || !arr[0]) return []

    var newArr = []

    for (var id of arr) {
      var member = this.guild.members.cache.get(id)
      if (!member) arr.splice(arr.indexOf(id), 1)
      else newArr.push(member)
    }

    this.updateData({
      requests: arr
    })

    return newArr
  }

  acceptRequest(memberId) {
    if (!memberId) throw new Error('The member id to accept is not defined [Club:acceptRequest]')

    var member = this.guild.members.cache.get(memberId)
    if (!member) throw new Error('The member is not defined [Club:acceptRequest].')
    var requests = this.club.requests || []
    if (!requests.includes(memberId)) throw new Error('The member did not apply request to club [Club:acceptRequest].')
    var banneds = this.club.banneds || []
    if (banneds.includes(member.id)) throw new Error('Member banned from this club [Club:acceptRequest].')
    var members = this.club.members || []

    if (this.club.role) {
      try {
        member.roles.add(this.club.role)
      } catch (e) {}
    }
    requests.splice(requests.indexOf(memberId), 1)
    members.push(member.id)

    this.updateData({
      requests: requests,
      members: members
    })

    return `Successfully accepted ${member.user.tag}`
  }

  memberKick(memberId) {
    if (!memberId) throw new Error('The member id to kick is not defined [Club:memberKick]')

    var member = this.guild.members.cache.get(memberId)
    if (!member) throw new Error('The member is not defined [Club:memberKick].')

    var members = this.club.members || []
    if (!members.includes(memberId)) throw new Error('The member is not in this club [Club:memberKick].')

    members.splice(members.indexOf(memberId))
    if (this.club.role && member.roles.cache.get(this.club.role)) {
      try {
        member.roles.remove(this.club.role)
      } catch (e) {}
    }

    this.updateData({
      members: members
    })

    return `Successfully kicked ${member.user.tag}`
  }

  memberBan(memberId) {
    if (!memberId) throw new Error('The member id to ban is not defined [Club:memberBan].')

    var member = this.guild.members.cache.get(memberId)
    if (!member) throw new Error('The member is not defined [Club:memberBan].')

    var banneds = this.club.banneds
    if (banneds.includes(member.id)) throw new Error('The member has already banned from this club [Club:memberBan].')

    var members = this.club.members || []
    if (members.includes(memberId)) this.memberKick(memberId)

    banneds.push(memberId)
    this.updateData({
      banneds: banneds
    })
    return `Successfully banned ${member.user.tag}`
  }

  updateData(data) {
    if (typeof data !== 'object') throw new Error('Data to update must be an object [Club:updateData].')
    clubsDB.updateOne({
      owner: this.club.owner
    }, {
      $set: data
    })
  }
}

module.exports = async (bot, db, optionsFind) => {
  if (!optionsFind) throw new Error('Options for search is not defined [Club].')
  if (typeof optionsFind !== 'function') throw new Error('Options for search must be a function [Club].')

  var clubsDB = db.collection('clubs')
  var clubs = await clubsDB.find().toArray()
  var club = clubs.filter(optionsFind)[0]
  if (!club) throw new Error('404: Club not found. [Club]')

  var Club = new ClubGet(bot, db, club)
  return Club
}