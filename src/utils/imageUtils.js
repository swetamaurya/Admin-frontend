import { BASE_URL } from '../config';

// Utility function to get full image URL
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) return url;
  
  // If it starts with /uploads, prepend BASE_URL
  if (url.startsWith('/uploads')) {
    const fullUrl = `${BASE_URL}${url}`;
    console.log(`Image URL: ${url} -> ${fullUrl}`);
    return fullUrl;
  }
  
  // If it doesn't start with /, add it
  if (!url.startsWith('/')) {
    const fullUrl = `${BASE_URL}/uploads/${url}`;
    console.log(`Image URL: ${url} -> ${fullUrl}`);
    return fullUrl;
  }
  
  // Default case
  const fullUrl = `${BASE_URL}${url}`;
  console.log(`Image URL: ${url} -> ${fullUrl}`);
  return fullUrl;
};

// Utility function to get image URL for main site
export const getMainSiteImageUrl = (url) => {
  return getImageUrl(url);
};

// Utility function to get image URL for admin panel
export const getAdminImageUrl = (url) => {
  return getImageUrl(url);
};

// Utility function to validate image URL
export const isValidImageUrl = (url) => {
  if (!url) return false;
  const fullUrl = getImageUrl(url);
  return fullUrl.startsWith('http');
};

// Utility function to get image URL with fallback
export const getImageUrlWithFallback = (url, fallbackUrl = '/images/placeholder.jpg') => {
  const imageUrl = getImageUrl(url);
  return imageUrl || fallbackUrl;
};
