'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import profileDefault from '@/assets/images/profile.png';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [codeforcesId, setCodeforcesId] = useState('Not provided yet');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserCfId = async (userId) => {
      if (!userId) {
       return;
      }

      try {
        const res = await fetch(`/api/profile/${userId}`);

        if (res.status === 200) {
          const data = await res.json();
          if(data.codeforcesId){
            setCodeforcesId(data.codeforcesId)
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user properties when session is available
    if (session?.user?.id) {
      fetchUserCfId(session.user.id);
    }
  }, [session]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/profile/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codeforcesId })
      });
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message);
        setIsEditing(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Could not update ID');
      console.log(error);
    }
  };

  return loading ? <Spinner loading={loading}/> : (
    <section className='bg-blue-50'>
      <div className='container m-auto py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <h1 className='text-3xl font-bold mb-4'>Your Profile</h1>
          <div className='flex flex-col md:flex-row'>
            <div className='md:w-1/4 mx-20 mt-10'>
              <div className='mb-4'>
                <Image
                  className='h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0'
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt='User'
                />
              </div>
              <h2 className='text-2xl mb-4'>
                <span className='font-bold block'>Name: </span> {profileName}
              </h2>
              <h2 className='text-2xl'>
                <span className='font-bold block'>Email: </span> {profileEmail}
              </h2>
            </div>
            <div className='md:w-3/4 md:pl-4 text-xl max-sm:mt-5'>
              <div className='mb-4'>
                <label className='block text-gray-700 font-bold mb-2'>
                  Codeforces ID : 
                </label>
                <div className='flex items-center'>
                  <input
                    type='text'
                    id='codeforcesId'
                    name='codeforcesId'
                    className='border rounded w-full py-2 px-3 mb-2'
                    required
                    value={codeforcesId}
                    disabled={!isEditing}
                    onChange={(e) => setCodeforcesId(e.target.value)}
                  />
                  <FaEdit
                    className='ml-2 cursor-pointer'
                    onClick={handleEditClick}
                  />
                </div>
                {isEditing && (
                  <button
                    className='mt-2 bg-blue-500 text-white py-2 px-4 rounded'
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
