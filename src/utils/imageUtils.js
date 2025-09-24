

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Utility function to get full image URL
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) {
    console.log(`Image URL (already full): ${url}`);
    return url;
  }
  
  // Clean BASE_URL to ensure no trailing slash
  const cleanBaseUrl = BASE_URL.replace(/\/$/, '');
  
  // If it starts with /uploads, prepend BASE_URL
  if (url.startsWith('/uploads')) {
    const fullUrl = `${cleanBaseUrl}${url}`;
    console.log(`Image URL: ${url} -> ${fullUrl}`);
    return fullUrl;
  }
  
  // If it starts with uploads/, prepend BASE_URL with /
  if (url.startsWith('uploads/')) {
    const fullUrl = `${cleanBaseUrl}/${url}`;
    console.log(`Image URL: ${url} -> ${fullUrl}`);
    return fullUrl;
  }
  
  // If it doesn't start with /, add /uploads/
  if (!url.startsWith('/')) {
    const fullUrl = `${cleanBaseUrl}/uploads/${url}`;
    console.log(`Image URL: ${url} -> ${fullUrl}`);
    return fullUrl;
  }
  
  // Default case - prepend BASE_URL
  const fullUrl = `${cleanBaseUrl}${url}`;
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
