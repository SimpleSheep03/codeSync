// import Notification from "./models/Notification.js"
import User from "./models/User.js"

const send = async () => {
    const message = ''
    const users = await User.find({})
    for(const user of users){
        // const notification = new Notification({
        //     sender : '66b764c1a382a0010dd51d56',

        // })
        console.log(user._id)
    }
}

send()