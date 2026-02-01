import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
interface ImageGalleryProps {
  images: string[];
  alt?: string;
}
export function ImageGallery({
  images,
  alt = 'Property image'
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };
  const goToNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };
  return <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-video rounded-card overflow-hidden cursor-pointer" onClick={() => setIsFullscreen(true)}>
          <AnimatePresence mode="wait">
            <motion.img key={currentIndex} src={images[currentIndex]} alt={`${alt} ${currentIndex + 1}`} initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} transition={{
            duration: 0.3
          }} className="w-full h-full object-cover" />
          </AnimatePresence>

          {/* Navigation Arrows */}
          {images.length > 1 && <>
              <button onClick={e => {
            e.stopPropagation();
            goToPrevious();
          }} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors" aria-label="Previous image">
                <ChevronLeftIcon className="w-5 h-5 text-primary" />
              </button>
              <button onClick={e => {
            e.stopPropagation();
            goToNext();
          }} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors" aria-label="Next image">
                <ChevronRightIcon className="w-5 h-5 text-primary" />
              </button>
            </>}

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((image, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`
                  flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden
                  transition-all duration-200
                  ${index === currentIndex ? 'ring-2 ring-button-primary' : 'opacity-60 hover:opacity-100'}
                `}>
                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>)}
          </div>}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={() => setIsFullscreen(false)}>
            <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors" aria-label="Close fullscreen">
              <XIcon className="w-6 h-6" />
            </button>

            <img src={images[currentIndex]} alt={`${alt} ${currentIndex + 1}`} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />

            {images.length > 1 && <>
                <button onClick={e => {
            e.stopPropagation();
            goToPrevious();
          }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" aria-label="Previous image">
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button onClick={e => {
            e.stopPropagation();
            goToNext();
          }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" aria-label="Next image">
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </>}
          </motion.div>}
      </AnimatePresence>
    </>;
}