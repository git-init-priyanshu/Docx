import { uuidv4 as uuid } from "lib0/random.js";

import Avatar from "@/public/profilepic_placeholder.png"
import type { Document, User } from ".prisma/client";
import { MAX_VERSIONS, shouldSnapshot } from "@/app/writer/[id]/versions/policy";

export const createGuestUser = () => {
  const user = {
    id: uuid(),
    username: "anonymous",
    name: "Anonymous",
    email: "anonymous@email.com",
    password: null,
    picture: Avatar.src,
    isVerified: false,
    verifyCode: null,
    verifyCodeExpiry: null,
    joinedAt: new Date(),
  }
  localStorage.setItem('user', JSON.stringify(user))

  return user;
}
export const getGuestUser = () => {
  let user: User = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user?.id) {
    user = createGuestUser();
  }

  return user;
}
export const createGuestDocument = (initialData?: string) => {
  const user = getGuestUser();

  const newDocument: Document = {
    id: uuid(),
    userId: user.id,
    name: "Untitled document",
    data: initialData ?? "",
    createdAt: new Date(),
    updatedAt: new Date(),
    // Guest documents never reach the server, so they are never indexed.
    indexedHash: null,
    thumbnail: null,
    deleteUrl: null,
    linkAccess: "NONE",
    // Importing from Google Docs needs a session, so a guest document is
    // always one someone started here.
    source: "BLANK",
    // Only stored documents need a preview, to keep a list of them off the
    // wire. A guest's documents are already on this machine.
    preview: null
  }

  const allDocuments: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');
  localStorage.setItem('documents', JSON.stringify([...allDocuments, newDocument]))

  return newDocument;
}
export const getAllGuestDocuments = () => {
  const documents: Document[] = JSON.parse(localStorage.getItem('documents') || '[]') as Document[];

  const user = getGuestUser();

  const data = documents.map((doc) => {
    return {
      id: doc.id,
      // Reading the whole body costs nothing here — it never leaves the
      // machine — so the thumbnail draws straight from it.
      preview: doc.data,
      name: doc.name,
      updatedAt: doc.updatedAt,
      createdBy: { id: user.id, name: user.name, picture: user.picture },
      users: [{
        user: {
          id: user.id,
          name: user.name,
          picture: user.picture
        }
      }]
    }
  })
  return data.reverse();
}
export const getGuestDocumentDetails = (docId: string) => {
  const allDocuments: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');

  let document = allDocuments.find(e => e.id === docId);
  if (!document) return;

  return document;
}
export const updateGuestDocument = (docId: string, docProp: string, updateValue: string) => {
  const document = getGuestDocumentDetails(docId);
  if (!document) return;

  const allDocuments: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');
  const index = allDocuments.findIndex((e) => e.id === document.id);

  if (docProp === 'thumbnail') {
    allDocuments.splice(index, 1, { ...document, [docProp]: `data:image/png;base64,${updateValue}`, updatedAt: new Date() });
  } else {
    allDocuments.splice(index, 1, { ...document, [docProp]: updateValue, updatedAt: new Date() });
  }
  localStorage.setItem('documents', JSON.stringify(allDocuments));
}
export const deleteGuestDocument = (docId: string) => {
  const document = getGuestDocumentDetails(docId);
  if (!document) return;

  const allDocuments: Document[] = JSON.parse(localStorage.getItem('documents') || '[]');
  const index = allDocuments.findIndex((e) => e.id === document.id);

  allDocuments.splice(index, 1);
  localStorage.setItem('documents', JSON.stringify(allDocuments));

  localStorage.removeItem(versionsKey(docId));
}

type GuestVersion = { id: string; data: string; createdAt: string };

const versionsKey = (docId: string) => `versions:${docId}`;

// Newest first, matching the ordering GetDocVersions returns for signed-in users.
export const getGuestVersions = (docId: string): GuestVersion[] =>
  JSON.parse(localStorage.getItem(versionsKey(docId)) || '[]');

export const createGuestVersion = (docId: string, data: string) => {
  const versions = getGuestVersions(docId);
  if (!shouldSnapshot(versions[0], data)) return false;

  const next = [
    { id: uuid(), data, createdAt: new Date().toISOString() },
    ...versions,
  ].slice(0, MAX_VERSIONS);

  localStorage.setItem(versionsKey(docId), JSON.stringify(next));

  return true;
}

export const restoreGuestVersion = (docId: string, versionId: string) => {
  const version = getGuestVersions(docId).find((e) => e.id === versionId);
  if (!version) return;

  updateGuestDocument(docId, 'data', version.data);

  return version.data;
}
