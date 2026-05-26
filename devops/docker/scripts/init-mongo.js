db.createUser({
  user: "admin",
  pwd: "password",
  roles: [
    {
      role: "root",
      db: "admin"
    }
  ]
});

db = db.getSiblingDB('notes-management');

db.createCollection('users');
db.createCollection('notes');

db.createIndex({ users: { email: 1 } });
db.createIndex({ notes: { uploadedBy: 1, createdAt: -1 } });

console.log('✓ MongoDB initialized');
