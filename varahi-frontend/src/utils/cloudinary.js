export const optimizeCloudinaryUrl = (url, width = 256) => {
  if (!url) return "";
  return url.replace("/upload/", `/upload/f_webp,q_auto,w_${width}/`);
};
