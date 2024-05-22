import Link from 'next/link'
import React from 'react'

const ContestCard = ({ contest }) => {
  return (
    <div key={contest._id.$oid} className='p-4 bg-white shadow-md rounded-md'>
      <Link href={`/contest/${contest._id}`}>
        <h2 className='text-2xl font-semibold mb-2 text-blue-700 underline'>
          Contest ID: {contest._id}
        </h2>
      </Link>
      <h3 className='text-xl mb-2 text-gray-700'>Number of Questions: {contest.numberOfQuestions}</h3>
      <h3 className='text-xl mb-2 text-gray-700'>Contestants: {contest.contestants.join(', ')}</h3>
      <h3 className='text-xl mb-2 text-gray-700'>Rating Range: {contest.lowerLimit} - {contest.upperLimit}</h3>
      <h3 className='text-xl mb-2 text-gray-700'>Time Limit: {contest.timeLimit} minutes</h3>
      <h3 className='text-xl mb-2 text-gray-700'>Start Time: {new Date(contest.timeStart).toLocaleString()}</h3>
      <h3 className='text-xl mb-2 text-gray-700'>End Time: {new Date(contest.timeEnding).toLocaleString()}</h3>
      <div>
        <h4 className='text-lg font-semibold mb-2 text-primary'>Problems:</h4>
        <ul className='list-disc list-inside'>
          {contest.problemList.map(problem => (
            <li key={problem.contestId + problem.index} className='text-gray-700'>
              {problem.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ContestCard
