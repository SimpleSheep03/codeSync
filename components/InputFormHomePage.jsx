'use client'
import React, { useEffect, useState } from 'react'
import { ratings, questions, time, tags } from '@/constants/formData'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Spinner from './Spinner'
import Link from 'next/link'

const InputFormHomePage = () => {

  const router = useRouter()
  const { data: session } = useSession()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [contestantType , setContestantType] = useState('Team')
  const [selectedTeam , setSelectedTeam] = useState('')
  const [data, setData] = useState({
    codeforcesId1: '',
    codeforcesId2: '',
    codeforcesId3: '',
    numQuestions: '6',
    lowerDifficulty: '1200',
    upperDifficulty: '1800',
    timeLimit: '120',
    tags: []
  })

  useEffect(() => {
    const fetchTeams = async () => {
      if (!session || !session.user) {
        return
      }
      try {
        const res = await fetch(`/api/profile/${session.user.id}`)
        const result = await res.json()
        setTeams(result.teams)
        setData((prevData) => ({ ...prevData, codeforcesId1: result.codeforcesId }))
      } catch (error) {
        console.log(error)
        toast.error('Could not fetch teams')
      }
    }

    fetchTeams()

  }, [session])

  const handleContestantTypeChange = (e) => {
    setContestantType(e.target.value)
    if(e.target.value === 'Individual'){
      setData((prevData) => ({
        ...prevData,
        codeforcesId2: '',
        codeforcesId3: ''
      }))
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'tags') {
      const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
      setData({
        ...data,
        [id]: selectedTags
      });
    } else {
      setData({
        ...data,
        [id]: value
      });
    }
  }

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      tags: checked ? [...prevData.tags, value] : prevData.tags.filter((tag) => tag !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if(data.tags.length === 0){
      data.tags = tags
    }
    try {
      const res = await fetch('/api/create-contest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()
      if (result.ok) {
        toast.success(result.message)
        const id = result.id
        router.push(`/contest/${id}`)
      }
      else {
        toast.error(result.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(result.message)
    }
    finally {
      setLoading(false)
    }
  }

  const handleTeamSelect = (e) => {
    setSelectedTeam(e.target.value)
    const teamId = e.target.value;
    const selectedTeam = teams.find(team => team._id === teamId);

    if (selectedTeam) {
      const { codeforcesHandles } = selectedTeam;
      setData(prevData => ({
        ...prevData,
        codeforcesId1: codeforcesHandles[0] || '',
        codeforcesId2: codeforcesHandles[1] || '',
        codeforcesId3: codeforcesHandles[2] || '',
      }));
    }
  };

  useEffect(() => {
    if (contestantType === 'Team') {
      const matchingTeam = teams.find(team => {
        const handles = team.codeforcesHandles;
        const enteredHandles = [data.codeforcesId1, data.codeforcesId2, data.codeforcesId3].filter(Boolean); // remove empty values
        return handles.length === enteredHandles.length && handles.every(handle => enteredHandles.includes(handle));
      });
      if (matchingTeam) {
        setSelectedTeam(matchingTeam._id);
      } else {
        setSelectedTeam('');
      }
    }
  }, [data.codeforcesId1, data.codeforcesId2, data.codeforcesId3, teams, contestantType]);
  
  const createAddTeamUrl = () => {
    const params = new URLSearchParams();
    const handles = [data.codeforcesId1]
    if(data.codeforcesId2 != ''){
      handles.push(data.codeforcesId2)
    }
    if(data.codeforcesId3){
      handles.push(data.codeforcesId3)
    }
    handles.map((handle , index) => {
      params.append(`codeforcesId${index + 1}` , handle)
    })
    return `/add-team?${params.toString()}`;
  };

  return  (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-700">Create Custom Contest</h1>
      <form className="space-y-4">
          <div className='flex flex-wrap'>
            <label htmlFor='contestantType' className="w-full mb-1 text-sm font-medium">Contestant Type</label>
            <select name="contestantType" id="contestantType" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={(e) => handleContestantTypeChange(e)}>
              <option value={'Team'}>Team</option>
              <option value={'Individual'}>Individual</option>
            </select>
          </div>
        {contestantType === 'Team' && (
          <div className='md:flex md:justify-between space-y-4'>
            <div className="flex flex-wrap md:px-3">
              <label htmlFor="teamSelect" className="w-full mb-1 text-sm font-medium">Choose a Team : (to auto-fill IDs)</label>
              <select id="teamSelect" name="teamSelect" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleTeamSelect} value={selectedTeam}>
                <option value="Select Team">Select Team</option>
                {teams.map(team => (
                  <option key={team._id} value={team._id}>{team.teamName}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap md:px-3">
              <label htmlFor="codeforcesId1" className="w-full mb-1 text-sm font-medium">Your Codeforces ID:</label>
              <input type="text" id="codeforcesId1" name="codeforcesId1" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" value={data.codeforcesId1} disabled/>
            </div>

            <div className="flex flex-wrap md:px-3">
              <label htmlFor="codeforcesId2" className="w-full mb-1 text-sm font-medium">Codeforces ID 2:</label>
              <input type="text" id="codeforcesId2" name="codeforcesId2" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.codeforcesId2} />
            </div>

            <div className="flex flex-wrap md:px-3">
              <label htmlFor="codeforcesId3" className="w-full mb-1 text-sm font-medium">Codeforces ID 3:</label>
              <input type="text" id="codeforcesId3" name="codeforcesId3" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.codeforcesId3} placeholder='(Optional)' />
            </div>
            {selectedTeam === '' && (data.codeforcesId2 !== '' || data.codeforcesId3 !== '') && (
              <div className="flex flex-wrap md:px-3">
                <Link href={createAddTeamUrl()} className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">Add this team (optional)</Link>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap">
          <label htmlFor="numQuestions" className="w-full mb-1 text-sm font-medium ">Number of Questions:</label>
          <select id="numQuestions" name="numQuestions" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.numQuestions}>
            {questions.map((question) => (
              <option key={question} value={question}>{question}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap">
          <label htmlFor="lowerDifficulty" className="w-full mb-1 text-sm font-medium">Select the lower limit for questions rating:</label>
          <select id="lowerDifficulty" name="lowerDifficulty" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.lowerDifficulty}>
            {ratings.map((rating) => (
              <option value={rating} key={rating}>{rating}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap">
          <label htmlFor="upperDifficulty" className="w-full mb-1 text-sm font-medium">Select the upper limit for questions rating:</label>
          <select id="upperDifficulty" name="upperDifficulty" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.upperDifficulty} min={data.lowerDifficulty}>
            {ratings.map((rating) => (
              rating >= data.lowerDifficulty &&
              <option value={rating} key={rating}>{rating}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap">
          <label htmlFor="timeLimit" className="w-full mb-1 text-sm font-medium">Time Limit (Minutes):</label>
          <select id="timeLimit" name="timeLimit" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={handleChange} value={data.timeLimit}>
            {time.map((t) => (
              <option value={t} key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-6 max-sm:grid-cols-3 max-sm:gap-3 max-md:grid-cols-4 max-md:gap-2">
          <label className="col-span-3 text-sm font-medium mb-3">Filter Specific Problem Tags: (Leave unchecked if you don't want to apply filter)</label>
          {tags.map((tag) => (
            <div key={tag} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={tag}
                name="tags"
                value={tag}
                className="mr-2"
                onChange={handleCheckboxChange}
                checked={data.tags.includes(tag)}
              />
              <label htmlFor={tag} className="text-sm">{tag}</label>
            </div>
          ))}
        </div>

        <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400" onClick={handleSubmit} disabled={loading}>
          {!loading ? <>Create Contest</> : <>Loading...</>}
        </button>
      </form>
    </div>
  )
}

export default InputFormHomePage
