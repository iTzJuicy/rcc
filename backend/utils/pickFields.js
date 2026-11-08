export function pickFields(source, fields) {
  return fields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});
}

export function pickSeo(seo) {
  if (!seo || typeof seo !== "object" || Array.isArray(seo)) return {};
  return pickFields(seo, ["metaTitle", "metaDescription", "ogImage"]);
}
