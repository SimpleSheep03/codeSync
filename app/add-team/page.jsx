'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaMinusCircle } from 'react-icons/fa';

const CodeforcesForm = () => {
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [ids, setIds] = useState(['']);
  const router = useRouter();

  useEffect(() => {
    if (!session) return;
    if (session && session.user && session.codeforcesId === '') {
      router.push('/provide-codeforces-handle');
      return;
    } else {
      setIds([session.codeforcesId, '']);
    }
  }, [session]);

  const handleTeamNameChange = (event) => {
    setTeamName(event.target.value);
  };

  const handleChange = (index, event) => {
    const newIds = [...ids];
    newIds[index] = event.target.value;
    setIds(newIds);
  };

  const handleAddField = () => {
    if (ids.length < 3) {
      setIds([...ids, '']);
    }
  };

  const handleRemoveField = (index) => {
    const newIds = ids.filter((_, i) => i !== index);
    setIds(newIds);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/add-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, ids }),
      });
      const data = await res.json();
      if (data.ok) {
        toast.success(data.message);
        router.push('/profile');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return !session ? (
    <div className="flex mt-10 justify-center h-screen">
      <span className='text-3xl text-pink-700'>Please Sign In to add a team</span>
    </div>
  ) : (
    <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-pink-700">Enter Team Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={handleTeamNameChange}
            placeholder="Team Name"
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        {ids.map((id, index) => (
          <div key={index} className="mb-4 flex items-center">
            <input
              type="text"
              value={id}
              disabled={index === 0}
              onChange={(e) => handleChange(index, e)}
              placeholder={`Codeforces ID ${index + 1}`}
              className="flex-1 border border-gray-300 p-2 rounded-md"
              required
            />
            {ids.length > 1 && index !== 0 && (
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaMinusCircle className="w-6 h-6" />
              </button>
            )}
          </div>
        ))}
        {ids.length < 3 && (
          <button
            type="button"
            onClick={handleAddField}
            className="mb-4 text-blue-500 hover:text-blue-700"
          >
            Add another ID
          </button>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700" disabled={loading}
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CodeforcesForm;
