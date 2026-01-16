'use client';

import { useState } from 'react';
import { useAdminApi } from '@/components/hooks/use-admin-api';

interface BlogData extends Record<string, unknown> {
  title: string;
  content: string;
  category?: string;
  excerpt?: string;
  featured?: boolean;
  image?: string;
}

interface Blog extends BlogData {
  _id: string;
  author: {
    uid: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  published: boolean;
  views: number;
  comments: unknown[];
}

/**
 * Admin Blog Management Hook
 * Demonstrates centralized API calls with authentication
 */
export function useAdminBlogs() {
  const api = useAdminApi();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  async function fetchBlogs() {
    try {
      const data = await api.get('/api/admin/blogs');
      setBlogs((data as Record<string, unknown>)?.blogs as Blog[] || []);
      return data;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw error;
    }
  }

  async function createBlog(blogData: BlogData) {
    try {
      const data = await api.post('/api/admin/blogs', blogData);
      setBlogs([...blogs, (data as Record<string, unknown>)?.blog as Blog]);
      return data;
    } catch (error) {
      console.error('Failed to create blog:', error);
      throw error;
    }
  }

  async function updateBlog(blogId: string, updates: Partial<BlogData>) {
    try {
      const data = await api.put(`/api/admin/blogs/${blogId}`, updates);
      setBlogs(blogs.map(b => b._id === blogId ? (data as Record<string, unknown>)?.blog as Blog : b));
      return data;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  }

  async function deleteBlog(blogId: string) {
    try {
      await api.delete(`/api/admin/blogs/${blogId}`);
      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  }

  return {
    blogs,
    loading: api.loading,
    error: api.error,
    fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}

