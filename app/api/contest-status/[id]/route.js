import connectDB from "@/config/database";
import Contest from "@/models/Contest";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";


export const GET = async (request, { params }) => {
    try {
        await connectDB();

    const { id } = params;

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response('User ID is required', {
        status: 401,
      });
    }

    const { userId } = sessionUser;

    const user = await User.findById(userId)

    const contest = await Contest.findById(id)

    if(!contest.contestants.includes(user.codeforcesId)){
        return new Response(JSON.stringify({ message : 'Unauthorized' , ok : false }), { status : 401 })
    }

    const common_questions = new Set([])

    for(const contestant of contest.contestants){
        const submissions = await fetch(`https://codeforces.com/api/user.status?handle=${contestant}&from=1&count=100000`).then(async(data) => await data.json())
        for(const submission of submissions.result){
            if(submission.verdict == 'OK'){
                common_questions.add(`${submission.problem.contestId}${submission.problem.index}`)
            }
        }
    }

    const solved = []
    contest.problemList.map((problem) => {
        if(common_questions.has(`${problem.contestId}${problem.index}`)){
            solved.push(problem)
        }
    })


    return new Response(JSON.stringify({ message : 'Questions fetched' , ok : true , solved }), { status : 200 })
        
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not fetch contest status' , ok : false}), { status : 500 })
    }
}