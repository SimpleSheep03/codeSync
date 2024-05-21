'use client'
import React, { useState } from 'react'
import { ratings , questions , time } from '@/constants/formData'

const InputFormHomePage = () => {

    const [data , setData] = useState({
        codeforcesId1 : '',
        codeforcesId2 : '',
        codeforcesId3 : '',
        numQuestions : '6',
        lowerDifficulty : '1200',
        upperDifficulty : '1800',
        timeLimit : '120'

    })

    const handleChange = (e) => {
        setData({
            ...data , 
            [e.target.id] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/create-contest' , {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data) 
              })

              const result = await res.json()
              
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div className="container mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Create Custom Contest</h1>
  <form className="space-y-4">
    <div className='md:flex md:justify-between space-y-4'>
    <div className="flex flex-wrap">
      <label htmlFor="codeforcesId1" className="w-full mb-1 text-sm font-medium">Codeforces ID 1:</label>
      <input type="text" id="codeforcesId1" name="codeforcesId1" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" required onChange =  {(e) => handleChange(e)} value={data.codeforcesId1}/>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="codeforcesId2" className="w-full mb-1 text-sm font-medium">Codeforces ID 2:</label>
      <input type="text" id="codeforcesId2" name="codeforcesId2" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.codeforcesId2} placeholder='(Optional)'/>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="codeforcesId3" className="w-full mb-1 text-sm font-medium">Codeforces ID 3:</label>
      <input type="text" id="codeforcesId3" name="codeforcesId3" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.codeforcesId3} placeholder='(Optional)'/>
    </div>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="numQuestions" className="w-full mb-1 text-sm font-medium ">Number of Questions:</label>
      <select id="numQuestions" name="numQuestions" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.numQuestions}>
        {
            questions.map((question) => (
                <option key={question} value={question}>{question}</option>
            ))
        }
      </select>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="lowerDifficulty" className="w-full mb-1 text-sm font-medium">Select the lower limit for questions rating:</label>
      <select id="lowerDifficulty" name="lowerDifficulty" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.lowerDifficulty}>
        {
            ratings.map((rating) => (
                <option value={rating} key={rating}>{rating}</option>
            ))
        }
      </select>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="upperDifficulty" className="w-full mb-1 text-sm font-medium">Select the upper limit for questions rating:</label>
      <select id="upperDifficulty" name="upperDifficulty" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.upperDifficulty} min={data.lowerDifficulty}>
        {
            ratings.map((rating) => (
                rating >= data.lowerDifficulty &&
                <option value={rating} key={rating}>{rating}</option>
            ))
        }
      </select>
    </div>

    <div className="flex flex-wrap">
      <label htmlFor="timeLimit" className="w-full mb-1 text-sm font-medium">Time Limit (Minutes):</label>
      <select id="timeLimit" name="timeLimit" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange =  {(e) => handleChange(e)} value={data.timeLimit}>
        {
            time.map((t) => (
                <option value={t} key={t}>{t}</option>
            ))
        }
      </select>
    </div>

    <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400" onClick={handleSubmit}>
      Create Contest
    </button>
  </form>
</div>

  )
}

export default InputFormHomePage