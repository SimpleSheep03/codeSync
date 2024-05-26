'use client';
import ContestCard from '@/components/ContestCard';
import Spinner from '@/components/Spinner';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchContests = async () => {
      if (session && session.user && session.codeforcesId === '') {
        router.push('/provide-codeforces-handle');
        return;
      }

      try {
        const res = await fetch(`/api/contest/with/${id}`);
        const data = await res.json();
        if (!data.ok) {
          toast.error(data.message);
          return;
        }

        setContests(data.contests);
      } catch (error) {
        console.error(error);
        toast.error('Could not fetch contests');
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [id]);

  return loading ? (
    <Spinner loading={loading} />
  ) : contests.length === 0 ? (
    <div className='container mx-auto p-8 mt-5'>
      <h1 className='text-4xl font-bold mb-10 text-center text-pink-700'>
        No Past Contests Found
      </h1>
      <p className='text-lg text-center text-gray-700'>
        There are currently no past contests associated with this ID.
      </p>
    </div>
  ) : !session ? (
    <div className="flex mt-10 justify-center h-screen">
      <span className="text-3xl text-pink-700">Please Sign In to View Contests</span>
    </div>) : (
    <div className='container mx-auto py-8'>
      <h1 className='text-4xl font-bold mb-6 text-center text-pink-700'>
        Past Contests
      </h1>
      <div className='space-y-4'>
        {contests.map((contest, index) => (
          <ContestCard contest={contest} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Page;
