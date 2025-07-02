import { Client, Databases, Query } from "appwrite";

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID || databaseId;

const client = new Client().setEndpoint(endpoint).setProject(projectId);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(databaseId, collectionId, [
      Query.equal("searchTerm", searchTerm),
    ]);

    // 2. If present, update count
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(databaseId, collectionId, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // 3. If not present, create a new document
      await database.createDocument(
        databaseId,
        collectionId,
        "unique()", // auto-generated ID
        {
          searchTerm,
          count: 1,
          poster_url: movie.poster_url, // required
          movieId: movie.movieId, // required
        }
      );
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(databaseId, collectionId, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
