'use client'
import CountdownTimer from '@/components/CountdownTimer'
import Spinner from '@/components/Spinner'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaCheckCircle } from 'react-icons/fa'


const page = () => {
  const { id } = useParams()
  const [contestData, setContestData] = useState({})
  const [loading, setLoading] = useState(true)
  const [solved, setSolved] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contest/${id}`)
        const data = await res.json()
        if (!data.ok) {
          console.log(data.message)
          toast.error(data.message)
          return
        }
        setContestData(data.contest)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    const fetchSolved = async () => {
      try {
        const res = await fetch(`/api/contest-status/${id}`)
        const data = await res.json()
        if (data.ok) {
          setSolved(data.solved)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
    fetchSolved()
  }, [id])

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/contest-status/${id}`)
        const data = await res.json()
        if (data.ok) {
          setSolved(data.solved)
        }
      } catch (error) {
        console.log(error)
      }
    }, 30000)

    const reloadTime = setInterval(async () => {

    })

    return () => clearInterval(timer)
  })

  const now = new Date()
  const targetDate = new Date(contestData.timeEnding)

  const difference = targetDate - now

  const millisecondsInSecond = 1000
  const millisecondsInMinute = millisecondsInSecond * 60
  const millisecondsInHour = millisecondsInMinute * 60
  const millisecondsInDay = millisecondsInHour * 24

  const days = Math.floor(difference / millisecondsInDay)
  const hours = Math.floor((difference % millisecondsInDay) / millisecondsInHour)
  const minutes = Math.floor((difference % millisecondsInHour) / millisecondsInMinute)
  const seconds = Math.floor((difference % millisecondsInMinute) / millisecondsInSecond)

  console.log(solved)
  console.log(contestData.problemList)

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <div className="container mx-auto px-4 py-8 mt-5">
      <h1 className='text-4xl text-pink-700 font-bold text-center'>Contest Page</h1>
      <div className='mt-5 mx-auto text-center'>
        <CountdownTimer targetDate={new Date(contestData.timeEnding)} />
        <div className='pt-5'>
          {contestData.problemList.map((problem, index) => (
            <div className='md:flex mt-10 md:justify-center' key={index}>
              <span className='text-blue-900 font-semibold'>{index + 1}. {problem.name}</span>
              <Link href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`} className='text-pink-900 bg-gray-100 p-1 rounded-xl ms-3 border hover:border-blue-200' target='_blank'>
                Open
              </Link>
              {solved.some(solvedProblem =>
                solvedProblem.contestId === problem.contestId && solvedProblem.index === problem.index
              ) && <FaCheckCircle className='text-green-500 ms-5' style={{ width: '24px', height: '24px' }} />
            }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page
