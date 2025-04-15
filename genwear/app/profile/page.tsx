'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface FormData {
  bio: string;
  phone: string;
  address: string;
  birthdate: Date | null;
}

export default function Profile() {
  const { user, updateUser, token } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>({
    bio: user?.bio || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthdate: user?.birthdate ? new Date(user.birthdate) : null
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        phone: user.phone || '',
        address: user.address || '',
        birthdate: user.birthdate ? new Date(user.birthdate) : null
      });
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      if (!token) {
        setError('Please log in to save changes');
        return;
      }

      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          ...formData,
          birthdate: formData.birthdate?.toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update the user context with the new data
      if (user) {
        updateUser({
          ...user,
          bio: formData.bio,
          phone: formData.phone,
          address: formData.address,
          birthdate: formData.birthdate ? formData.birthdate.toISOString() : undefined
        });
      }

      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');

      if (!token) {
        setError('Please log in to upload image');
        return;
      }

      const formData = new FormData();
      formData.append('token', token);
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      // Update the user context with the new image URL
      if (user) {
        updateUser({ ...user, profileImage: data.imageUrl });
      }

      setSuccess('Profile image updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
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
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="font-medium text-gray-700 hover:text-teal-600">
                  Home
                </Link>
                <Link href="/browse" className="font-medium text-gray-700 hover:text-teal-600">
                  Browse
                </Link>
                <Link href="#" className="font-medium text-gray-700 hover:text-teal-600">
                  Contact
                </Link>
                <Link href="#" className="font-medium text-gray-700 hover:text-teal-600">
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header/Banner */}
          <div className="h-48 bg-gradient-to-r from-teal-400 to-teal-600 relative">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-1 overflow-hidden">
                  {user?.profileImage ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                        sizes="(max-width: 128px) 100vw, 128px"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-teal-100 flex items-center justify-center text-4xl font-bold text-teal-600">
                      {user?.name?.charAt(0).toUpperCase() || ''}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {user?.name}
                </h1>
                <p className="text-gray-500">{user?.email}</p>
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
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.phone || 'Not provided'}</p>
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
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none w-full"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.address || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Birth Date</p>
                      {isEditing ? (
                        <DatePicker
                          selected={formData.birthdate}
                          onChange={(date) => handleInputChange('birthdate', date)}
                          dateFormat="MMMM d, yyyy"
                          maxDate={new Date()}
                          className="border-b border-gray-300 focus:border-teal-500 outline-none bg-transparent"
                          placeholderText="Select your birth date"
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          customInput={
                            <input
                              className="border-b border-gray-300 focus:border-teal-500 outline-none bg-transparent w-full"
                              placeholder="Select your birth date"
                            />
                          }
                        />
                      ) : (
                        <p className="text-gray-900">
                          {formData.birthdate ? formData.birthdate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">About Me</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-teal-600 hover:text-teal-700"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            bio: user?.bio || '',
                            phone: user?.phone || '',
                            address: user?.address || '',
                            birthdate: user?.birthdate ? new Date(user.birthdate) : null
                          });
                        }}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                {success && <p className="text-green-500 mb-2">{success}</p>}
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">{formData.bio || 'No bio added yet.'}</p>
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