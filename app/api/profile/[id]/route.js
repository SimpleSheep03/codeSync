import connectDB from "@/config/database"
import Team from "@/models/Team"
import User from "@/models/User"


export const GET = async (request , { params }) => {

    const url = new URL(request.url);
    const graph = url.searchParams.get('graph');

    const getContestType = (contestName) => {
        if (contestName.includes("Educational")) {
          return "Educational";
        } else if (contestName.includes("Global")) {
          return "Global Round";
        } else if (contestName.includes("Div. 1 + Div. 2")) {
          return "Div. 1 + Div. 2";
        } else if (contestName.includes("Div. 1")) {
          return "Div. 1";
        } else if (contestName.includes("Div. 2")) {
          return "Div. 2";
        } else if (contestName.includes("Div. 3")) {
          return "Div. 3";
        } else if (contestName.includes("Div. 4")) {
          return "Div. 4";
        } else if (contestName.includes("Kotlin")) {
          return "Kotlin Heroes";
        } else if (contestName.includes("ICPC")) {
          return "ICPC Related";
        } else {
          return "Standard Round";
        }
      };

    

    try {
        await connectDB()
        const { id } = params
        if(!id){
            return new Response(JSON.stringify({ message : 'Unauthorized' , ok : false }) , { status : 401 })
        }
        const user = await User.findById(id)

        if(!user){
            return new Response(JSON.stringify({ message : 'No such user exists' , ok : false }) , { status : 400 })
        }

        const { codeforcesId } = user

        const teams = await Team.find({ codeforcesHandles : { $in : [codeforcesId] }})

        if(!graph){
            return new Response(JSON.stringify({ message : 'Fetched user profile without graphs' , ok : true , codeforcesId , teams }) , { status : 200 })
        }

        //for rating vs problem count graph creation , collect the x and y coordinates
        let xPoints = [] , yPoints = []

        //for division vs rating change graph
        let division = [] , ratingChange = []

        //for question index vs time graph
        let questionIndex = [] , timeTaken = []
        
        try{
            //to avoid CF API bug , use a random number in count parameter
            const rnd = Math.floor(Math.random() * 100)

            const submissions = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesId}&count=${10000 + rnd}`).then(async (res) => await res.json())

            let submission_arr = []
            for(const sub of submissions.result){
                if(sub.verdict == 'OK'){
                    submission_arr.push(sub)
                }
            }

            //to sort in ascending order
            submission_arr.reverse()


            //fetch user contests list and add a random number to avoid CF API bug
            const user_contests = await fetch(`https://codeforces.com/api/user.rating?handle=${codeforcesId}&count=${1000 + rnd}`).then(async(res) => await res.json())

            let user_contests_arr = []
            for(const con of user_contests.result){
                user_contests_arr.push(con)
            }

            for(let i = 0 ; i < submission_arr.length ; i ++){
                const question_submission_time = submission_arr[i].creationTimeSeconds
                let most_recent_rating = 0
                for(let k = 0 ; k < user_contests_arr.length ; k ++){
                    if(user_contests_arr[k].ratingUpdateTimeSeconds <= question_submission_time){
                        most_recent_rating = user_contests_arr[k].newRating
                    }
                    else{
                        break;
                    }
                }
                xPoints.push(i + 1)
                yPoints.push(most_recent_rating)
            }
            xPoints.push(submission_arr.length)
            yPoints.push(user_contests_arr[user_contests_arr.length - 1].newRating)
            
            const map = new Map();
            const avg_rating_change = new Map()

            for (let i = 4 ; i < user_contests_arr.length ; i ++) {
                const contest = user_contests_arr[i]
                const contestType = getContestType(contest.contestName);
                map.set(contestType, (map.get(contestType) || 0) + 1);
                avg_rating_change.set(contestType , (map.get(contestType) || 0) + (contest.newRating - contest.oldRating))
            }

            avg_rating_change.forEach((change , contestType) => {
                division.push(contestType)
                ratingChange.push(Math.ceil(change / map.get(contestType)))
            });

            //map for storing the problems solved in a particular contest
            const map2 = {}

            //variable to store the contest id of the 20th user contest id from last
            const mn_contest_id = user_contests_arr[Math.max(0 , user_contests_arr.length - 20)].contestId

            for(const sub of submission_arr){
                //filter only the first accepted submissions of a user on any problem of a contest which is not older than the 20th contest from last for the user
                if(sub.author.participantType == 'CONTESTANT' &&
                    sub.verdict == 'OK' && sub.problem.contestId >= mn_contest_id
                ){
                    if(!map2[sub.contestId]){
                        map2[sub.contestId] = []
                    }
                    if(!(map2[sub.contestId]).includes(sub)){
                        map2[sub.contestId].push(sub)
                    }
                }
            }

            //map for storing the data corresponding to a particular questionIndex
            const map3 = new Map()
            const map4 = new Map()

            Object.entries(map2).forEach(([contestId, submissions]) => {
                if (submissions[0].problem.rating) {
                  let prevTime = submissions[0].author.startTimeSeconds;
              
                  for (const sub of submissions) {
                    map3.set(sub.problem.rating, (map3.get(sub.problem.rating) || 0) + sub.creationTimeSeconds - prevTime);
                    prevTime = sub.creationTimeSeconds;
                    map4.set(sub.problem.rating, (map4.get(sub.problem.rating) || 0) + 1);
                  }

                }
              });
              
            
            map3.forEach((value , key) => {
                questionIndex.push(key)
                timeTaken.push(Math.floor(value / (map4.get(key) * 60)))
            })
            
            //to sort the questionIndex
            const data = [];
            map3.forEach((value, key) => {
            data.push({
                questionIndex: key,
                timeTaken: Math.floor(value / (map4.get(key) * 60))
            });
            });

            data.sort((a, b) => a.questionIndex - b.questionIndex);
            questionIndex = data.map(item => item.questionIndex);
            timeTaken = data.map(item => item.timeTaken);
            
            // for(let i = 0 ; i < timeTaken.length ; i ++){
            //     console.log(questionIndex[i] , timeTaken[i])
            // }
            
        }
        catch(error){
            console.log(error)
            console.log('Codeforces API is currently down... Please again try later')
            return new Response(JSON.stringify({ message : 'Codeforces API is currently down... Please again try later' , ok : false , codeforcesId , APIDown : true ,  teams , xPoints , yPoints }) , { status : 503 })
        }

        return new Response(JSON.stringify({ message : 'User details found along with graphs' , ok : true , codeforcesId , teams , xPoints , yPoints , division , ratingChange , questionIndex , timeTaken }) , { status : 200 })

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Unable to fetch profile' , ok : false }) , { status : 500 })
    }
}

export const PUT = async (request , { params }) => {
    try {
        await connectDB()
        const { id } = params
        if(!id){
            return new Response(JSON.stringify({ message : 'Unauthorized' , ok : false }) , { status : 401 })
        }
        const user = await User.findById(id)

        if(!user){
            return new Response(JSON.stringify({ message : 'No such user exists' , ok : false }) , { status : 400 })
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