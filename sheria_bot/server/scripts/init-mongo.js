// MongoDB initialization script for Docker
db = db.getSiblingDB('sheriabot');

// Create collections
db.createCollection('constitution_articles');
db.createCollection('legal_topics');
db.createCollection('legal_aid_providers');
db.createCollection('faqs');
db.createCollection('chat_sessions');

// Create indexes for better performance
db.constitution_articles.createIndex({ "article_number": 1 }, { unique: true });
db.constitution_articles.createIndex({ "chapter_number": 1 });
db.constitution_articles.createIndex({ "is_bill_of_rights_article": 1 });
db.constitution_articles.createIndex({ "keywords": 1 });
db.constitution_articles.createIndex({ "$**": "text" });

db.legal_topics.createIndex({ "category": 1 });
db.legal_topics.createIndex({ "keywords": 1 });
db.legal_topics.createIndex({ "$**": "text" });

db.legal_aid_providers.createIndex({ "location.county": 1 });
db.legal_aid_providers.createIndex({ "type": 1 });
db.legal_aid_providers.createIndex({ "is_mombasa_based": 1 });

db.faqs.createIndex({ "category": 1 });
db.faqs.createIndex({ "keywords": 1 });
db.faqs.createIndex({ "is_active": 1 });

db.chat_sessions.createIndex({ "session_id": 1 }, { unique: true });
db.chat_sessions.createIndex({ "started_at": -1 });

print('Database initialized successfully!');