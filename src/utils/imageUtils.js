

// Utility function to get full image URL
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL (Cloudinary or any other), return as is
  if (url.startsWith('http')) {
    console.log(`Image URL (Cloudinary/full URL): ${url}`);
    return url;
  }
  
  // For any non-HTTP URLs, log a warning since we're now using Cloudinary
  console.warn(`Non-HTTP image URL detected: ${url}. This should be a Cloudinary URL.`);
  
  // Return the URL as-is (shouldn't happen with Cloudinary)
  return url;
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
  // Cloudinary URLs should always start with https://res.cloudinary.com
  return url.startsWith('https://res.cloudinary.com') || url.startsWith('http');
};

// Utility function to get image URL with fallback
export const getImageUrlWithFallback = (url, fallbackUrl = 'https://via.placeholder.com/300x300?text=No+Image') => {
  const imageUrl = getImageUrl(url);
  return imageUrl || fallbackUrl;
};
