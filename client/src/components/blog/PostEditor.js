import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const PostEditor = ({ post, onSubmit, isSubmitting }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [tags, setTags] = useState(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState(post?.coverImage || '');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: post?.title || '',
      summary: post?.summary || '',
      content: post?.content || '',
      coverImage: post?.coverImage || '',
      status: post?.status || 'published',
    },
  });
  
  const contentValue = watch('content');
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };
  
  const handleCoverImageChange = (e) => {
    const imageUrl = e.target.value;
    setCoverImagePreview(imageUrl);
  };
  
  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tags,
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
        placeholder="Enter post title"
      />
      
      {/* Summary */}
      <TextArea
        label="Summary"
        {...register('summary', { 
          required: 'Summary is required',
          maxLength: {
            value: 200,
            message: 'Summary cannot be more than 200 characters',
          },
        })}
        error={errors.summary?.message}
        placeholder="Enter a brief summary of your post"
        rows={2}
      />
      
      {/* Cover Image URL */}
      <div>
        <Input
          label="Cover Image URL"
          {...register('coverImage')}
          onChange={(e) => {
            register('coverImage').onChange(e);
            handleCoverImageChange(e);
          }}
          placeholder="Enter image URL (optional)"
        />
        
        {coverImagePreview && (
          <div className="mt-2 relative">
            <img
              src={coverImagePreview}
              alt="Cover preview"
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x300?text=Invalid+Image+URL';
              }}
            />
          </div>
        )}
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(tag)}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex">
          <Input
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="mb-0"
          />
          <Button
            type="button"
            onClick={handleTagAdd}
            className="ml-2"
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
      </div>
      
      {/* Content Editor */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1 text-sm rounded-md ${
                !previewMode
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1 text-sm rounded-md ${
                previewMode
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        
        {previewMode ? (
          <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
            {contentValue ? (
              <div dangerouslySetInnerHTML={{ __html: contentValue.replace(/\n/g, '<br />') }} />
            ) : (
              <p className="text-gray-400 dark:text-gray-500">Nothing to preview</p>
            )}
          </div>
        ) : (
          <TextArea
            {...register('content', { required: 'Content is required' })}
            error={errors.content?.message}
            placeholder="Write your post content here..."
            rows={12}
          />
        )}
        
        {/* Markdown Tips */}
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>Formatting tips:</p>
          <ul className="list-disc list-inside ml-2">
            <li>Use **bold** for <strong>bold text</strong></li>
            <li>Use *italic* for <em>italic text</em></li>
            <li>Use # Header for headers</li>
            <li>Use - or * for bullet points</li>
            <li>Use ![alt text](image-url) to add images</li>
            <li>Use [link text](url) for links</li>
          </ul>
        </div>
      </div>
      
      {/* Post Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status')}
              value="published"
              className="form-radio h-4 w-4 text-primary-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Published</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('status')}
              value="draft"
              className="form-radio h-4 w-4 text-primary-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Draft</span>
          </label>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export default PostEditor; 