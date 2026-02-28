'use client';

interface CarouselProps {
  direction?: 'left' | 'right';
  images: { src: string; alt: string; caption: string }[];
}

// Duplicate for seamless infinite scroll
export default function ImageCarousel({ direction = 'left', images }: CarouselProps) {
  const doubled = [...images, ...images];

  return (
    <div className="w-full overflow-hidden py-4">
      <div
        className={`flex gap-4 ${direction === 'left' ? 'carousel-track-left' : 'carousel-track-right'}`}
      >
        {doubled.map((slide, i) => (
          <div
            key={i}
            className="shrink-0 w-[260px] sm:w-[300px] rounded-xl overflow-hidden relative"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading="lazy"
              className="w-full h-[160px] sm:h-[180px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-semibold text-white/90">{slide.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const FOOTER_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing ring under dramatic lights',
    caption: 'Train like a champion',
  },
  {
    src: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=600&h=360&fit=crop&q=80',
    alt: 'Boxer training with heavy bag',
    caption: 'AI-powered form analysis',
  },
  {
    src: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600&h=360&fit=crop&q=80',
    alt: 'Fighter in boxing stance',
    caption: 'Real-time coaching feedback',
  },
  {
    src: 'https://images.unsplash.com/photo-1615117972428-28de67cda58e?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing workout session',
    caption: 'Voice-guided drills',
  },
  {
    src: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=600&h=360&fit=crop&q=80',
    alt: 'Boxer shadow boxing in gym',
    caption: 'Personalized sessions',
  },
  {
    src: 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing gym atmosphere',
    caption: 'Your corner, anywhere',
  },
];

export const HEADER_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1535469618671-e58a8c365cbd?w=600&h=360&fit=crop&q=80',
    alt: 'Boxer wrapping hands before training',
    caption: 'Prepare for battle',
  },
  {
    src: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=360&fit=crop&q=80',
    alt: 'Athlete in focused training',
    caption: 'Focus and discipline',
  },
  {
    src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&h=360&fit=crop&q=80',
    alt: 'Heavy bag training',
    caption: 'Power and precision',
  },
  {
    src: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing speed bag workout',
    caption: 'Speed training',
  },
  {
    src: 'https://images.unsplash.com/photo-1579017331263-ef82f0bbc748?w=600&h=360&fit=crop&q=80',
    alt: 'Fighter training intensely',
    caption: 'Push your limits',
  },
  {
    src: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing ring ropes close-up',
    caption: 'Step into the ring',
  },
];
