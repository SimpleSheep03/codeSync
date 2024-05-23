import connectDB from "@/config/database"
import Contest from "@/models/Contest"
import User from "@/models/User"


export const GET = async (request , { params }) => {
    try {
        await connectDB()
        const { id } = params
        if(!id){
            return new Response(JSON.stringify({ message : 'User Id is required' , ok : false }) , { status : 400 })
        }
        const user = await User.findById(id)

        if(user.length == 0){
            return new Response(JSON.stringify({ message : 'No such user exists' , ok : false }) , { status : 400 })
        }

        const contests = await Contest.find({ users : { $in : [id] } }).sort({ timeStart : -1 })
        
        return new Response(JSON.stringify({ message : 'Found contests' , ok : true , contests }) , { status : 200 })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not fetch contests' }), { status : 500 })
    }
}