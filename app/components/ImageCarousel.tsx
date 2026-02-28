'use client';

const SLIDES = [
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
    src: 'https://images.unsplash.com/photo-1583473848882-f9a5a4b3fbe0?w=600&h=360&fit=crop&q=80',
    alt: 'Boxing gloves ready for training',
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

// Duplicate for seamless infinite scroll
const DOUBLE_SLIDES = [...SLIDES, ...SLIDES];

export default function ImageCarousel() {
  return (
    <div className="w-full overflow-hidden py-6">
      <div className="carousel-track flex gap-4">
        {DOUBLE_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="carousel-slide shrink-0 w-[280px] sm:w-[320px] rounded-xl overflow-hidden relative group"
          >
            <img
              src={slide.src}
              alt={slide.alt}
              loading="lazy"
              className="w-full h-[180px] sm:h-[200px] object-cover"
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
