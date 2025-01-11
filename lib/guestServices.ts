import { uuidv4 as uuid } from "lib0/random.js";

import type { Document, User } from ".prisma/client";

export const createGuestUser = () => {
  const user = {
    id: uuid(),
    username: "anonymous",
    name: "Anonymous",
    email: "anonymous@email.com",
    password: null,
    picture: null,
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
export const createGuestDocument = () => {
  const user = getGuestUser();

  const newDocument: Document = {
    id: uuid(),
    userId: user.id,
    name: "Untitled document",
    data: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    thumbnail: null,
    deleteUrl: null
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
      thumbnail: doc.thumbnail,
      name: doc.name,
      updatedAt: doc.updatedAt,
      createdBy: user.id,
      users: [{
        user: {
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
    allDocuments.splice(index, 1, { ...document, [docProp]: `data:image/png;base64,${updateValue}` });
  } else {
    allDocuments.splice(index, 1, { ...document, [docProp]: updateValue });
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
}
