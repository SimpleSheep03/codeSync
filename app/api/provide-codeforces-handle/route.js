import connectDB from "@/config/database";
import User from "@/models/User";


export const POST = async (request) => {
    const data = await request.json()
    const { email, codeforcesHandle } = data;

    try {
      await connectDB();
      const check_user = await User.find({ codeforcesId : codeforcesHandle })
      if(check_user.length > 0){
        return new Response(JSON.stringify({ message : 'This ID has already been taken up by another user' , ok : false}), { status : 400 })
      }
      const check_user_2 = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesHandle}&checkHistoricHandles=false`).then(async(data) => await data.json())

      if(check_user_2.status == 'FAILED'){
        return new Response(JSON.stringify({ message : `Codeforces handle ${codeforcesHandle} is incorrect` , ok : false }) , { status : 400 })
      }

      const user = await User.findOne({ email })
      user.codeforcesId = codeforcesHandle
      await user.save()

      return new Response(JSON.stringify({ message : 'ID added successfully' , ok : true }), { status : 200 })
    } catch (error) {
      return new Response(JSON.stringify({ message : 'Could not add ID' , ok : false}), { status : 500 })
    }
}