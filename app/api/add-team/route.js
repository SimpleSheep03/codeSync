import connectDB from "@/config/database"
import Team from '@/models/Team'
import { getSessionUser } from "@/utils/getSessionUser"

export const POST = async (request) => {
    try {
        await connectDB()

        const session = getSessionUser()

        if(!session){
            return new Response(JSON.stringify({
                message : 'Unauthorized' , ok : false
            }) , { status : 401 })
        }

        const data = await request.json()

        const { ids , teamName } = data

        if(!ids || !teamName || ids == []){
            return new Response(JSON.stringify({ message : 'Required fields not provided' , ok : false}) , { status : 400 })
        }

        let codeforcesHandles = []

        for(const id of ids){
            const user = await fetch(`https://codeforces.com/api/user.info?handles=${id}&checkHistoricHandles=false`).then(async(data) => await data.json())
            if(user.status == 'FAILED'){
                return new Response(JSON.stringify({ message : `Could not find the handle ${id}` , ok : false }) , { status : 400 })
            }
            codeforcesHandles.push(user.result[0].handle)
        }

        const team = new Team({
            teamName,
            codeforcesHandles
        })

        await team.save()

        return new Response(JSON.stringify({
            message : 'Team added successfully' , ok : true , team
        }), { status : 200 })


    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Server error... Please try again' , ok : false }), { status : 500 })
    }
}