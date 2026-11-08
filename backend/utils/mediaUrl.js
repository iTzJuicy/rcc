function normalizeMediaUrl(value) {
  if (typeof value !== "string") return value;
  return value.replace(/^\/images\/(.+)\.png$/, "/images/$1.webp");
}

export function normalizeMediaDocument(document) {
  const data = document?.toObject ? document.toObject() : { ...document };

  for (const field of ["image", "coverImage"]) {
    data[field] = normalizeMediaUrl(data[field]);
  }

  if (Array.isArray(data.gallery)) {
    data.gallery = data.gallery.map(normalizeMediaUrl);
  }

  return data;
}

export function normalizeMediaDocuments(documents) {
  return documents.map(normalizeMediaDocument);
}
