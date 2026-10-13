import React from 'react';
import { MediaGalleryPage } from './MediaGalleryPage';

// Backwards compatibility re-export
export const ARGalleryPage: React.FC = () => {
  return <MediaGalleryPage />;
};

export default ARGalleryPage;
