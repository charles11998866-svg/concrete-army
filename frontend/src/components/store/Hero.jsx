import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = ({ onExploreClick }) => {
  return (
    <section className="hero" data-testid="hero-section">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow" />
      
      {/* Hero image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1770513984014-6a532a0adf61?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwzfHxjeWJlcnB1bmslMjBzdHJlZXR3ZWFyJTIwbmVvbiUyMGZhc2hpb258ZW58MHx8fHwxNzcyOTg1Njk3fDA&ixlib=rb-4.1.0&q=85"
          alt="Hero"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-violet-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI-Powered Curation
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter uppercase leading-none mb-8"
            data-testid="hero-title"
          >
            The Future
            <br />
            <span className="text-violet-500">Drops Here</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-12 max-w-xl"
            data-testid="hero-description"
          >
            Discover trending products curated by AI. From tech gadgets to streetwear, 
            find what's next before everyone else.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={onExploreClick}
              className="btn-primary flex items-center gap-3 group"
              data-testid="explore-button"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              className="btn-secondary"
              data-testid="ai-picks-button"
            >
              AI Recommendations
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
