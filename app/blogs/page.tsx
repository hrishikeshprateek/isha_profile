'use client';

import React, { useState } from 'react';
import Toolbar from '@/components/Toolbar';

// Mock blog data for content creator/travel vlogger
const blogPosts = [
  {
    id: 1,
    title: 'Hidden Gems of Southeast Asia',
    excerpt: 'Discover the untold stories and secret locations that most travelers miss. From secluded beaches to mountain villages...',
    category: 'Travel',
    date: 'January 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Content Creation Tips for Beginners',
    excerpt: 'Starting your journey as a content creator? Here are essential tips that helped me grow from zero to thousands...',
    category: 'Content Creation',
    date: 'January 8, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'A Week in the Himalayas',
    excerpt: 'Join me on an incredible journey through the majestic Himalayan mountains, where every sunrise tells a story...',
    category: 'Travel',
    date: 'January 5, 2026',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Building an Authentic Brand',
    excerpt: 'Authenticity is key in content creation. Learn how to stay true to yourself while building a successful brand...',
    category: 'Content Creation',
    date: 'January 3, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Street Food Adventures in India',
    excerpt: 'Exploring the vibrant flavors and culinary traditions through local street food. A gastronomic journey you cannot miss...',
    category: 'Food & Culture',
    date: 'December 28, 2025',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1554978991-33ef7f31d658?w=800&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'Photography Essentials for Travel',
    excerpt: 'Master the art of travel photography with these essential tips and techniques that will transform your content...',
    category: 'Photography',
    date: 'December 25, 2025',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
  },
];

const categories = ['All', 'Travel', 'Content Creation', 'Food & Culture', 'Photography'];

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF0E6]">
      {/* Reusable Toolbar */}
      <Toolbar
        title="Blog"
        showBackButton={true}
        backHref="/d1"
        navItems={["Home", "Services", "My Projects", "Reviews", "Contact"]}
        showContactButton={false}
      />

      {/* Simple Top Section */}
      <div className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient leading-tight mb-4">
            Travel Stories & Creative Insights
          </h1>
          <p className="text-lg md:text-xl text-body-text max-w-2xl mx-auto">
            Join me on adventures around the world and discover tips for content creation
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'text-[#3B241A] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F2A7A7] after:rounded-full'
                  : 'text-[#A68B7E] hover:text-[#DC7C7C]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className={`glass rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer fade-in-up stagger-${(index % 4) + 1}`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full glass-nav text-xs font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-body-text text-xs leading-relaxed mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                <button className="inline-flex items-center gap-2 text-primary font-medium text-xs group-hover:gap-3 transition-all">
                  Continue Reading
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 glass rounded-2xl p-6 md:p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-block">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Never Miss a Story
            </h2>
            <p className="text-base text-body-text">
              Subscribe to get the latest travel stories and content creation tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-2.5 rounded-full border-2 border-border focus:border-primary focus:outline-none transition-colors text-sm"
              />
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-lg text-sm">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Join 5,000+ creators and travelers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
