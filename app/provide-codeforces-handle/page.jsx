'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const ProvideCodeforcesHandle = () => {
  const { data: session } = useSession();
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const router = useRouter();

  useEffect(() => {
    if(session && session.user && session.codeforcesId != ''){
        router.push('/')
    }
  }, [session])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await fetch('/api/provide-codeforces-handle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email, codeforcesHandle }),
        });
        const data = await res.json()
        if(data.ok){
            toast.success(data.message)
            session.codeforcesId = codeforcesHandle
            router.push('/')
        }   
        else{
            toast.error(data.message)
            console.log()
        }
    }
    catch(error){
        console.log(error)
        toast.error('Failed to upload ID')
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-pink-700 mt-10">Provide Your Codeforces Handle</h1>
      <form onSubmit={handleSubmit}>
        <label className="block text-gray-700 mt-5">Codeforces Handle  (YOU CANNOT CHANGE THIS IN THE FUTURE)</label>
        <input
          type="text"
          value={codeforcesHandle}
          onChange={(e) => setCodeforcesHandle(e.target.value)}
          className="border rounded w-full py-2 px-3"
          required
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProvideCodeforcesHandle;
