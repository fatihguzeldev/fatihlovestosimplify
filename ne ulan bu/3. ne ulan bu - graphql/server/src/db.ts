export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export const db = {
  users: new Map<string, User>(),
  posts: new Map<string, Post>(),
};

db.users.set('1', { id: '1', name: 'John Doe', email: 'john@example.com' });
db.users.set('2', { id: '2', name: 'Jane Smith', email: 'jane@example.com' });

db.posts.set('1', {
  id: '1',
  title: 'First Post',
  content: 'Hello GraphQL!',
  authorId: '1',
});