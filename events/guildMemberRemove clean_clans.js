class Event {
    constructor() { }

    async execute(bot, mongo, member) {

        console.log(member)

        if (member.guild.id == "581181840832987176") {
            let db = await mongo.db("joi").collection("clubs")

            let clubs = await db.find().toArray()

            console.log(member.id)

            for (let index = 0; index < clubs.length; ++index) {

                let members = clubs[index].members

                members = members.filter((n) => { return n != member.id });

                await db.findOneAndUpdate({ "name": clubs[index].name }, { "$set": { "members": members } })
            }

        }

    }
}
module.exports = (...args) => {
    new Event().execute(...args);
};