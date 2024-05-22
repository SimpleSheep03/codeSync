'use client'
import CountdownTimer from '@/components/CountdownTimer'
import Spinner from '@/components/Spinner'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {

  const { id } = useParams()
  const [contestData , setContestData] = useState({})
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contest/${id}`)
        const data = await res.json()
        if(!data.ok){
          console.log(data.message)
          toast.error(data.message)
          return
        }
        setContestData(data.contest)
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }

    fetchData()
  } , [])

  const now = new Date();
  const targetDate = new Date(contestData.timeEnding);

  const difference = targetDate - now;

  const millisecondsInSecond = 1000;
  const millisecondsInMinute = millisecondsInSecond * 60;
  const millisecondsInHour = millisecondsInMinute * 60;
  const millisecondsInDay = millisecondsInHour * 24;

  const days = Math.floor(difference / millisecondsInDay);
  const hours = Math.floor((difference % millisecondsInDay) / millisecondsInHour);
  const minutes = Math.floor((difference % millisecondsInHour) / millisecondsInMinute);
  const seconds = Math.floor((difference % millisecondsInMinute) / millisecondsInSecond);
  

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <div className="container mx-auto px-4 py-8 mt-5">
      <h1 className='text-4xl text-pink-700 font-bold text-center'>Contest Page</h1>
      <div className='mt-5 mx-auto text-center'>
        <CountdownTimer targetDate={new Date(contestData.timeEnding)}/>
        <div className='pt-5'>
        {contestData.problemList.map((problem , index) => (
          <div className='md:flex mt-10 md:justify-center'>
            <span className='text-blue-900 font-semibold'>{index + 1}. {problem.name}</span>
            <Link href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`} className='text-pink-900 bg-gray-100 p-1 rounded-xl ms-3  border hover:border-blue-200' target='_blank'>Open
            </Link>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default page