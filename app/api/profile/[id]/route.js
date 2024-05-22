import connectDB from "@/config/database"
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
            return new Response(JSON.stringify({ message : 'Unauthorized' , ok : false }) , { status : 401 })
        }

        const { codeforcesId } = user

        return new Response(JSON.stringify({ message : 'User found' , ok : true , codeforcesId }) , { status : 200 })

    } catch (error) {
        console.log(error)
    }
}

export const PUT = async (request , { params }) => {
    try {
        await connectDB()
        const { id } = params
        if(!id){
            return new Response(JSON.stringify({ message : 'User Id is required' , ok : false }) , { status : 400 })
        }
        const user = await User.findById(id)

        if(user.length == 0){
            return new Response(JSON.stringify({ message : 'Unauthorized' , ok : false }) , { status : 401 })
        }

        const data = await request.json()
        user.codeforcesId = data.codeforcesId

        await user.save()

        return new Response(JSON.stringify({ message : 'ID updated successfully' , ok : true }) , { status : 200 })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not update ID' , ok : false}) , { status : 500 })
    }
}