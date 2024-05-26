import connectDB from "@/config/database";
import Contest from '@/models/Contest'
import Team from "@/models/Team";
import User from "@/models/User";


export const POST = async (request) => {
  try {
    const data = await request.json();

    await connectDB()

    const {
      codeforcesId1,
      codeforcesId2,
      codeforcesId3,
      numQuestions,
      lowerDifficulty,
      upperDifficulty,
      timeLimit,
      tags,
      contestantType,
      selectedTeam
    } = data;

    if (
      !codeforcesId1 ||
      !numQuestions ||
      !lowerDifficulty ||
      !upperDifficulty ||
      !timeLimit ||
      !tags ||
      !contestantType
    ) {
      return new Response(JSON.stringify({ message: "Fill all the fields" , ok : false }), {
        status: 400,
      });
    }

    
    const total_questions = await fetch(
      `https://codeforces.com/api/problemset.problems`
    ).then(async (data) => await data.json());

    if(total_questions.status == 'FAILED'){
        return new Response(
            JSON.stringify({ message: "Failed to fetch questions" , ok : false }),
            { status: 500 }
          );
    }

    const user1_from_cf_submissions = await fetch(
      `https://codeforces.com/api/user.status?handle=${codeforcesId1}&from=1&count=100000`
    ).then(async (data) => await data.json());

    if (user1_from_cf_submissions.status == "FAILED") {
        return new Response(
            JSON.stringify({ message: `Codeforces handle ${codeforcesId1} is invalid` , ok : false }),
            { status: 400 }
          );
    }

    const st = new Set([]);

    user1_from_cf_submissions.result.map((problem) => {
        st.add(`${problem.problem.contestId}${problem.problem.index}`);
    });

    if (codeforcesId2 != '') {
      const user2_from_cf_submissions = await fetch(
        `https://codeforces.com/api/user.status?handle=${codeforcesId2}&from=1&count=100000`
      ).then(async (data) => await data.json());

      if (user2_from_cf_submissions.status == "FAILED") {
        return new Response(
          JSON.stringify({ message: `Codeforces handle ${codeforcesId2} is invalid` , ok : false }),
          { status: 400 }
        );
      }

      user2_from_cf_submissions.result.map((problem) => {
          st.add(`${problem.problem.contestId}${problem.problem.index}`);
      });
    }

    if (codeforcesId3 != '') {
      const user3_from_cf_submissions = await fetch(
        `https://codeforces.com/api/user.status?handle=${codeforcesId3}&from=1&count=100000`
      ).then(async (data) => await data.json());

      if (user3_from_cf_submissions.status == "FAILED") {
        return new Response(
          JSON.stringify({ message: `Codeforces handle ${codeforcesId3} is invalid` , ok : false}),
          { status: 400 }
        );
      }

      user3_from_cf_submissions.result.map((problem) => {
          st.add(`${problem.problem.contestId}${problem.problem.index}`);
      });
    }

    let newList = [];

    while (newList.length < numQuestions) {
      const index = Math.floor(
        Math.random() * total_questions.result.problems.length
      );

      const problem = total_questions.result.problems[index];

      if (
        !st.has(`${problem.contestId}${problem.index}`) &&
        problem.rating <= upperDifficulty &&
        problem.rating >= lowerDifficulty && 
        problem.tags.some((tag) => tags.includes(tag))
      ) {
        newList.push(
          problem
        );
      }
    }

    let users = []
    
    if(codeforcesId1 != ''){
      const user1 = await User.find({ codeforcesId : codeforcesId1 })
      if(user1.length > 0){
        users.push(user1[0]._id)
      }
    }
    if(codeforcesId2 != ''){
      const user2 = await User.find({ codeforcesId : codeforcesId2 })
      if(user2.length > 0){
        users.push(user2[0]._id)
      }
    }
    
    if(codeforcesId3 != ''){
      const user3 = await User.find({ codeforcesId : codeforcesId3 })
      if(user3.length > 0){
        users.push(user3[0]._id)
      }
    }

    let contestants = [codeforcesId1]
    if(codeforcesId2 != ''){
      contestants.push(codeforcesId2)
    }
    if(codeforcesId3 != ''){
      contestants.push(codeforcesId3)
    }

    const now = new Date()
    const newDate = new Date(now.getTime() + timeLimit * 60000)

    let teamId = selectedTeam
    if(!teamId || teamId == '' || teamId == 'Select Team'){
      teamId = undefined
    }

    const contest = new Contest({
      users,
      problemList : newList,
      contestants,
      numberOfQuestions : numQuestions,
      lowerLimit : lowerDifficulty,
      upperLimit : upperDifficulty,
      timeLimit,
      timeStart : now,
      timeEnding : newDate,
      contestantType,
      team: teamId ? teamId : undefined,
    })

    await contest.save()

    const id = contest._id;

    return new Response(JSON.stringify({ message : 'Contest created' , id , ok : true }) , { status : 200 })

  } catch (error) {
    console.log(error);
    return new Response(
        JSON.stringify({ message: "Failed to create a contest" , ok : false }),
        { status: 500 }
      );;
  }
};
