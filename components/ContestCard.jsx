import Link from "next/link";
import React from "react";
import { FaExternalLinkAlt } from 'react-icons/fa';

const ContestCard = ({ contest }) => {
  return (
    <div key={contest._id} className="p-10 bg-gray-50 shadow-md rounded-md border border-pink-100">
      <div className="mb-4">
        <Link href={`/contest/${contest._id}`} target="_blank">
          <span className="inline-flex items-center text-blue-700 underline">
            <h2 className="text-2xl mr-2 font-semibold">Contest Page</h2>
            <FaExternalLinkAlt />
          </span>
        </Link>
      </div>
      <h3 className="text-xl mb-2 text-gray-700">
        Participation Type: {contest.contestantType}
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        Contestants: &nbsp;
        {contest.contestants.map((contestant, index) => (
          <>
            <Link
              href={`https://codeforces.com/profile/${contestant}`}
              key={index}
              className="text-pink-900 underline"
              target="_blank"
            >
              {contestant}
            </Link>
            {index < contest.contestants.length - 1 && " , "}
          </>
        ))}
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        Number of Questions: {contest.numberOfQuestions}
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        Rating Range: {contest.lowerLimit} - {contest.upperLimit}
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        Time Limit: {contest.timeLimit} minutes
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        Start Time: {new Date(contest.timeStart).toLocaleString()}
      </h3>
      <h3 className="text-xl mb-2 text-gray-700">
        End Time: {new Date(contest.timeEnding).toLocaleString()}
      </h3>
      <div>
        <h4 className="text-lg font-semibold mb-2 text-primary">Problems:</h4>
        <ul className="list-disc list-inside">
          {contest.problemList.map((problem) => (
            <li
              className="text-gray-700"
              key={problem.contestId + problem.index}
            >
              <Link
                href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                target="_blank"
                className="text-blue-700 underline"
              >
                {problem.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContestCard;
