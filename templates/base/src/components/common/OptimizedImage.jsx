import { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  loading = 'lazy',
  sizes = '100vw'
}) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // Dynamic import of the image to leverage Vite's built-in optimization
    import(`../../assets/${src}`).then(image => {
      setImageSrc(image.default);
    }).catch(err => {
      console.error('Error loading image:', err);
      setImageSrc(src); // Fallback to original src
    });
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      sizes={sizes}
    />
  );
};

export default OptimizedImage;