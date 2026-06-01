import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios/axiosInstance';
import { ImageIcon, Loader2 } from 'lucide-react';

const AuthenticatedImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = null;

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        setError(true);
        return;
      }

      // If it's a data URL, blob URL, or external unsplash image, just use it directly
      if (src.startsWith('data:') || src.startsWith('blob:') || (src.startsWith('http') && !src.includes(import.meta.env.VITE_API_URL))) {
          setImageSrc(src);
          setLoading(false);
          return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(src, {
          responseType: 'blob',
        });
        
        objectUrl = URL.createObjectURL(response.data);
        setImageSrc(objectUrl);
        setError(false);
      } catch (err) {
        console.error('Error loading authenticated image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center animate-pulse`}>
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`${className} bg-gray-50 flex items-center justify-center border border-gray-200`}>
        <ImageIcon className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

export default AuthenticatedImage;
