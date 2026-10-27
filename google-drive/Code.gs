/**
 * Wedding photo dump → Google Drive
 *
 * 1. Paste Code.gs into https://script.google.com → New project.
 * 2. Set UPLOAD_TOKEN below (long random secret for uploads).
 *    Category folders are already mapped in CATEGORY_FOLDER_IDS.
 * 5. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone  ← NOT “Anyone with a Google account”
 * 6. In the editor, run testListEngagement (▶) once to authorize Drive.
 *    Do not run doGet from the editor — it has no request parameters.
 * 7. Copy the /exec URL into .env.local:
 *    NEXT_PUBLIC_GOOGLE_DRIVE_SCRIPT_URL=...
 *    NEXT_PUBLIC_GOOGLE_DRIVE_UPLOAD_TOKEN=... (same as UPLOAD_TOKEN)
 */

/** Parent album: Wedding Photo Dump */
const ROOT_FOLDER_ID = "1MSIkWzFYz_0wSVHLIcdMtbTdzUzRmwhK";

/** Must match NEXT_PUBLIC_GOOGLE_DRIVE_UPLOAD_TOKEN in .env.local */
const UPLOAD_TOKEN = "PASTE_A_LONG_RANDOM_SECRET";

/** Must match site tab ids: engagement | reception | wedding */
const CATEGORY_FOLDER_IDS = {
  engagement: "1yasmD_7z4m7MOJQfD9LbIQScwdwyZ8sk",
  reception: "1x_LDMWZqtHsaaWzLHcRkBz2TRGFn4RHU",
  wedding: "1_nEBuLF4B7k6LyOyUTUcvQepjPI8gGJZ",
};

function eventParams(e) {
  if (e && e.parameter) return e.parameter;
  return {};
}

/** Run from editor (▶) to verify Drive access — not used by the website */
function testListEngagement() {
  Logger.log(JSON.stringify(listImages("engagement")));
}

function doGet(e) {
  try {
    var params = eventParams(e);
    var action = (params.action || "list").toLowerCase();
    if (action === "list") {
      var category = params.category;
      if (!category) throw new Error("Missing category");
      return respond(e, listImages(category));
    }
    throw new Error("Unknown action");
  } catch (err) {
    return respond(e, { error: String(err.message || err) });
  }
}

function doPost(e) {
  var body;
  try {
    body = parsePostBody(e);
  } catch (err) {
    return jsonResponse({ error: String(err.message || err) });
  }

  try {
    assertToken(body.token);
    var action = (body.action || "").toLowerCase();
    if (action === "upload") {
      return finishPost(body, uploadImage(body));
    }
    if (action === "delete") {
      return finishPost(body, deleteImage(body.fileId));
    }
    throw new Error("Unknown action");
  } catch (err) {
    return finishPost(body, { error: String(err.message || err) });
  }
}

function finishPost(body, obj) {
  if (body && body.delivery === "parent") {
    return parentNotifyResponse(obj);
  }
  return jsonResponse(obj);
}

function parentNotifyResponse(obj) {
  var message = JSON.stringify({ type: "wedding-drive-upload", payload: obj });
  var html =
    "<!DOCTYPE html><html><body><script>" +
    "window.parent.postMessage(" +
    message +
    ', "*");' +
    "</script></body></html>";
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(
    HtmlService.XFrameOptionsMode.ALLOWALL
  );
}

function parsePostBody(e) {
  e = e || {};
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }
  if (e.postData && e.postData.contents) {
    var contents = e.postData.contents;
    if (contents.indexOf("payload=") === 0) {
      return JSON.parse(decodeURIComponent(contents.replace(/^payload=/, "")));
    }
    return JSON.parse(contents);
  }
  throw new Error("Missing body");
}

function respond(e, obj) {
  var callback = eventParams(e).callback;
  if (callback && /^[a-zA-Z_$][\w.$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput(
      callback + "(" + JSON.stringify(obj) + ")"
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return jsonResponse(obj);
}

function assertToken(token) {
  if (!UPLOAD_TOKEN || UPLOAD_TOKEN.indexOf("PASTE") === 0) {
    throw new Error("Set UPLOAD_TOKEN in Code.gs");
  }
  if (token !== UPLOAD_TOKEN) {
    throw new Error("Unauthorized");
  }
}

function getCategoryFolder(category) {
  const folderId = CATEGORY_FOLDER_IDS[category];
  if (!folderId) {
    throw new Error("Unknown category: " + category);
  }
  return DriveApp.getFolderById(folderId);
}

function isFileInAlbum(fileId) {
  const file = DriveApp.getFileById(fileId);
  const parents = file.getParents();
  const allowed = {};
  Object.keys(CATEGORY_FOLDER_IDS).forEach(function (key) {
    allowed[CATEGORY_FOLDER_IDS[key]] = true;
  });
  while (parents.hasNext()) {
    if (allowed[parents.next().getId()]) {
      return true;
    }
  }
  return false;
}

function ensureLinkSharing(file) {
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    /* ignore — may already be shared */
  }
}

function getResourceKey(file) {
  try {
    return file.getResourceKey() || "";
  } catch (err) {
    return "";
  }
}

function driveImagePayload(file) {
  ensureLinkSharing(file);
  var id = file.getId();
  var rk = getResourceKey(file);
  var rkAmp = rk ? "&resourcekey=" + encodeURIComponent(rk) : "";
  var viewUrl = "https://drive.google.com/uc?export=view&id=" + id + rkAmp;
  var thumbUrl =
    "https://drive.google.com/thumbnail?id=" + id + "&sz=w1200" + rkAmp;
  var lh3Url = "https://lh3.googleusercontent.com/d/" + id + "=w1200-rw";

  return {
    id: id,
    name: file.getName(),
    mimeType: file.getMimeType(),
    createdAt: file.getDateCreated().getTime(),
    url: viewUrl,
    fullUrl: viewUrl,
    lh3Url: lh3Url,
    fallbacks: [viewUrl, lh3Url, thumbUrl],
  };
}

function listImages(category) {
  const folder = getCategoryFolder(category);
  const files = [];
  const iterator = folder.getFiles();
  while (iterator.hasNext()) {
    const file = iterator.next();
    const mime = file.getMimeType();
    if (mime.indexOf("image/") !== 0) continue;
    files.push(driveImagePayload(file));
  }
  files.sort(function (a, b) {
    return b.createdAt - a.createdAt;
  });
  return { files: files };
}

function uploadImage(body) {
  const category = body.category;
  const name = body.name || "photo.jpg";
  const mimeType = body.mimeType || "image/jpeg";
  const data = body.data;
  if (!category || !data) {
    throw new Error("Missing category or data");
  }

  const bytes = Utilities.base64Decode(data);
  const blob = Utilities.newBlob(bytes, mimeType, name);
  const file = getCategoryFolder(category).createFile(blob);

  return {
    file: driveImagePayload(file),
  };
}

function deleteImage(fileId) {
  if (!fileId) throw new Error("Missing fileId");
  if (!isFileInAlbum(fileId)) {
    throw new Error("File is not in a wedding album folder");
  }
  DriveApp.getFileById(fileId).setTrashed(true);
  return { ok: true };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
