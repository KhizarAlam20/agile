import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../utils/api';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { generateAvatarUrl } from '../utils/helpers';

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  
  const profilePictureValue = watch('profilePicture');
  
  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('profilePicture', user.profilePicture || '');
      setProfilePicturePreview(user.profilePicture || '');
    }
  }, [user, setValue]);
  
  useEffect(() => {
    if (profilePictureValue) {
      setProfilePicturePreview(profilePictureValue);
    }
  }, [profilePictureValue]);
  
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await usersAPI.updateProfile(data);
      
      // Update user data in context
      updateUserData(response.data.user);
      
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </h1>
        </CardHeader>
        
        <CardBody>
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-6"
            />
          )}
          
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
              <img
                src={profilePicturePreview || generateAvatarUrl(user?.name)}
                alt={user?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = generateAvatarUrl(user?.name);
                }}
              />
            </div>
            
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {user?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Name"
              {...register('name', {
                required: 'Name is required',
                maxLength: {
                  value: 50,
                  message: 'Name cannot be more than 50 characters',
                },
              })}
              error={errors.name?.message}
            />
            
            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
              disabled
            />
            
            <Input
              label="Profile Picture URL"
              {...register('profilePicture')}
              error={errors.profilePicture?.message}
              placeholder="Enter image URL (optional)"
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile; 