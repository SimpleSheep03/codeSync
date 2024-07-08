'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Spinner from '@/components/Spinner';

const ProvideCodeforcesHandle = () => {
  const { data: session } = useSession();
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const router = useRouter();
  const [loading , setLoading] = useState(true);
  const [submitLoading , setSubmitLoading] = useState(false);

  useEffect(() => {
    if(session && session.user && session.codeforcesId !== ''){
      router.push('/');
    }
    setLoading(false);
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try{
      const res = await fetch('/api/provide-codeforces-handle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email, codeforcesHandle }),
      });
      const data = await res.json();
      if(data.ok){
        toast.success('Your Codeforces handle has been successfully added!');
        session.codeforcesId = codeforcesHandle;
        router.push('/');
      } else {
        toast.error(data.message);
        console.log(data.message);
      }
    } catch(error) {
      console.log(error);
      toast.error('There was an error adding your handle. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <Spinner loading={loading}/>;
  }

  if (!session) {
    return (
      <div className="flex mt-10 justify-center h-screen">
        <span className="text-3xl text-pink-700">Please sign in first</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-10 py-8 bg-gray-50 border border-pink-50 mt-7 rounded-md shadow-md">
      <h1 className="text-3xl font-bold text-pink-700 text-center">Welcome!</h1>
      <p className="mt-4 text-gray-600 text-center">We're excited to have you here. Please provide your Codeforces handle to continue and enjoy all the features of our platform.</p>
      <form onSubmit={handleSubmit} className="mt-8 text-center">
        <label className="block text-gray-700">Codeforces Handle <span className="text-sm text-gray-500">(This cannot be changed later)</span></label>
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={codeforcesHandle}
            onChange={(e) => setCodeforcesHandle(e.target.value)}
            className="border rounded md:w-1/2 max-sm:w-full py-2 px-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Codeforces handle"
            required
          />
          <button type="submit" className="mt-5 bg-blue-500 text-white p-2 rounded hover:bg-blue-700" disabled={submitLoading}>
            {submitLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProvideCodeforcesHandle;
