import { PHOTO_DUMP_CATEGORIES } from "@/lib/wedding-data";
import { pickRandomDrivePhotos } from "@/lib/drive-photo-map";
import { isDriveConfigured, listDrivePhotos } from "@/lib/google-drive";

const HOME_GALLERY_COUNT = 6;

export async function loadRandomGalleryFromDrive(count = HOME_GALLERY_COUNT) {
  if (!isDriveConfigured()) return null;

  const allFiles = [];
  await Promise.all(
    PHOTO_DUMP_CATEGORIES.map(async (category) => {
      try {
        const files = await listDrivePhotos(category.id);
        allFiles.push(...files);
      } catch {
        /* skip category */
      }
    })
  );

  const picked = pickRandomDrivePhotos(allFiles, count);
  return picked.length > 0 ? picked : null;
}
