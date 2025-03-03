import { db } from "./db";

export const resolvers = {
  Query: {
    users: () => Array.from(db.users.values()),
    user: (_, { id }) => db.users.get(id),
    posts: () => Array.from(db.posts.values()),
    post: (_, { id }) => db.posts.get(id),
  },

  Mutation: {
    createUser: (_, { name, email }) => {
      const id = String(db.users.size + 1);
      const user = { id, name, email };
      db.users.set(id, user);
      return user;
    },
    createPost: (_, { title, content, authorId }) => {
      if (!db.users.has(authorId)) {
        throw new Error("Author not found");
      }
      const id = String(db.posts.size + 1);
      const post = { id, title, content, authorId };
      db.posts.set(id, post);
      return post;
    },
  },

  User: {
    posts: (parent) => {
      return Array.from(db.posts.values()).filter(
        (post) => post.authorId === parent.id
      );
    },
  },

  Post: {
    author: (parent) => {
      return db.users.get(parent.authorId);
    },
  },
};
