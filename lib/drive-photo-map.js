export function mapDriveFileToGalleryItem(file) {
  const fallbacks = [
    file.url,
    file.lh3Url,
    ...(file.fallbacks || []),
    file.fullUrl,
  ].filter(Boolean);

  const unique = [
    ...new Set(
      [
        ...fallbacks,
        file.id
          ? `https://lh3.googleusercontent.com/d/${file.id}=w1200-rw`
          : null,
        file.id ? `https://drive.google.com/uc?export=view&id=${file.id}` : null,
      ].filter(Boolean)
    ),
  ];

  return {
    kind: "drive",
    key: file.id,
    id: file.id,
    src: unique[0] || file.url,
    fullSrc: file.fullUrl || unique[0] || file.url,
    srcFallbacks: unique,
    mimeType: file.mimeType,
    alt: file.name || "Wedding photo",
    name: file.name,
  };
}

function shuffle(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function pickRandomDrivePhotos(allFiles, count = 6) {
  if (!allFiles.length) return [];
  const webFriendly = allFiles.filter((f) => {
    const n = (f.name || "").toLowerCase();
    const m = (f.mimeType || "").toLowerCase();
    return (
      !n.endsWith(".heic") &&
      !n.endsWith(".heif") &&
      !m.includes("heic") &&
      !m.includes("heif")
    );
  });
  const pool = webFriendly.length ? webFriendly : allFiles;
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map(mapDriveFileToGalleryItem);
}
