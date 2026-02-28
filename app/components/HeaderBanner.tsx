'use client';

import ImageCarousel, { FOOTER_IMAGES } from './ImageCarousel';

export default function HeaderBanner() {
  return (
    <div className="w-full overflow-hidden border-b border-[color:var(--border)]">
      <ImageCarousel direction="right" images={FOOTER_IMAGES} />
    </div>
  );
}
