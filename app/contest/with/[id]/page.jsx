'use client';
import ContestCard from '@/components/ContestCard';
import Spinner from '@/components/Spinner';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch(`/api/contest/with/${id}`);
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.message);
          return;
        }
        setContests(data.contests);
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [id]);

  return loading ? <Spinner loading={loading}/> : (
    <div className='container mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-6 text-center text-pink-700'>Contests</h1>
      <div className='space-y-4'>
        {contests.map((contest , index) => (
          <ContestCard contest={contest} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default Page;
