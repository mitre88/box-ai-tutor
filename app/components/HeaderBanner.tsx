'use client';

import ImageCarousel, { FOOTER_IMAGES } from './ImageCarousel';

export default function HeaderBanner() {
  return (
    <div className="w-full overflow-hidden border-t border-[color:var(--border)] mt-auto">
      <ImageCarousel direction="right" images={FOOTER_IMAGES} />
    </div>
  );
}
