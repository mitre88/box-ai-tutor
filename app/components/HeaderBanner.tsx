'use client';

import ImageCarousel, { HEADER_IMAGES } from './ImageCarousel';

export default function HeaderBanner() {
  return (
    <div className="w-full overflow-hidden border-b border-[color:var(--border)]">
      <ImageCarousel direction="right" images={HEADER_IMAGES} />
    </div>
  );
}
