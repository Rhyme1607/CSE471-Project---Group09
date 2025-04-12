'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthdate: user?.birthdate || '',
    bio: user?.bio || ''
  });

  // Update profile data when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        birthdate: user.birthdate,
        bio: user.bio
      });
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/Adobe Express - file.png"
                alt="GenWear Logo"
                width={32}
                height={32}
                className="text-teal-500"
              />
              <span className="text-xl font-bold text-teal-800">GenWear</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header/Banner */}
          <div className="h-48 bg-gradient-to-r from-teal-400 to-teal-600 relative">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center text-4xl font-bold text-teal-600">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="border-b border-gray-300 focus:border-teal-500 outline-none px-1"
                    />
                  ) : (
                    profileData.name
                  )}
                </h1>
                <p className="text-gray-500">{profileData.email}</p>
              </div>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none w-full"
                        />
                      ) : (
                        <p className="text-gray-900">{profileData.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Birth Date</p>
                      {isEditing ? (
                        <input
                          type="date"
                          value={profileData.birthdate}
                          onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none"
                        />
                      ) : (
                        <p className="text-gray-900">{new Date(profileData.birthdate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About Me</h2>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:border-teal-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Activity Stats */}
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-teal-600 mb-1">Orders</p>
                  <p className="text-2xl font-bold text-teal-700">12</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-teal-600 mb-1">Reviews</p>
                  <p className="text-2xl font-bold text-teal-700">8</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-teal-600 mb-1">Wishlist</p>
                  <p className="text-2xl font-bold text-teal-700">15</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-teal-600 mb-1">Points</p>
                  <p className="text-2xl font-bold text-teal-700">450</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 