"use client";
import { motion } from 'framer-motion';
import AppCard from './AppCard';

export default function AppSlider({ apps, loading }) {
  
  // LOADING STATE UPDATED TO SHOW 8 SKELETON CARDS
  if (loading) {
    // Ye array 8 times loop karega aur AppCard ko 'app={null}' dega.
    const skeletonApps = Array(8).fill(null); 
    
    return (
      <div className="flex gap-5 overflow-x-auto pb-8 px-6 no-scrollbar snap-x snap-mandatory">
        {skeletonApps.map((_, i) => (
          <div key={i} className="snap-start flex-shrink-0">
            <AppCard app={null} /> {/* Passing null to trigger Skeleton State in AppCard */}
          </div>
        ))}
      </div>
    );
  }

  // NORMAL SLIDER RENDER
  return (
    <div className="relative w-full">
      {/* Scrollable Container with Snap points for Mobile */}
      <div 
        className="flex gap-5 overflow-x-auto pb-8 px-6 no-scrollbar snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth' }}
      >
        {apps.map((app) => (
          <div key={app.id} className="snap-start flex-shrink-0">
            <AppCard app={app} />
          </div>
        ))}
      </div>
    </div>
  );
}