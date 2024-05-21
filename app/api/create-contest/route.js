import connectDB from "@/config/database";

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
    } = data;

    if (
      !codeforcesId1 ||
      !numQuestions ||
      !lowerDifficulty ||
      !upperDifficulty ||
      !timeLimit
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
            JSON.stringify({ message: "Could not find the first user details" , ok : false }),
            { status: 400 }
          );
    }

    const st = new Set([]);

    user1_from_cf_submissions.result.map((problem) => {
      if (problem.verdict == "OK") {
        st.add(`${problem.problem.contestId}${problem.problem.index}`);
      }
    });

    if (codeforcesId2 != '') {
      const user2_from_cf_submissions = await fetch(
        `https://codeforces.com/api/user.status?handle=${codeforcesId2}&from=1&count=100000`
      ).then(async (data) => await data.json());

      if (user2_from_cf_submissions.status == "FAILED") {
        return new Response(
          JSON.stringify({ message: "Could not find the second user details" , ok : false }),
          { status: 400 }
        );
      }

      user2_from_cf_submissions.result.map((problem) => {
        if (problem.verdict == "OK") {
          st.add(`${problem.problem.contestId}${problem.problem.index}`);
        }
      });
    }

    if (codeforcesId3 != '') {
      const user3_from_cf_submissions = await fetch(
        `https://codeforces.com/api/user.status?handle=${codeforcesId3}&from=1&count=100000`
      ).then(async (data) => await data.json());

      if (user3_from_cf_submissions.status == "FAILED") {
        return new Response(
          JSON.stringify({ message: "Could not find the third user details" , ok : false}),
          { status: 400 }
        );
      }

      user3_from_cf_submissions.result.map((problem) => {
        if (problem.verdict == "OK") {
          st.add(`${problem.problem.contestId}${problem.problem.index}`);
        }
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
        problem.rating >= lowerDifficulty
      ) {
        newList.push(
          `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "Contest created", questionList: newList , ok : true }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
        JSON.stringify({ message: "Failed to create a contest" , ok : false }),
        { status: 400 }
      );;
  }
};
