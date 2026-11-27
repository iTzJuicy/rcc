function normalizeMediaUrl(value) {
  if (typeof value !== "string") return value;
  return value.replace(/^\/images\/(.+)\.png$/, "/images/$1.webp");
}

export function normalizeMediaDocument(document) {
  const data = document?.toObject ? document.toObject() : { ...document };
  data.coverImage = normalizeMediaUrl(data.coverImage || data.image);
  data.image = data.coverImage;

  data.bannerImage = normalizeMediaUrl(data.bannerImage);

  if (Array.isArray(data.gallery)) {
    data.gallery = data.gallery.map(normalizeMediaUrl);
  }

  return data;
}

export function normalizeMediaDocuments(documents) {
  return documents.map(normalizeMediaDocument);
}
