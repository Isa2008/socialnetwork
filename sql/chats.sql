DROP TABLE IF EXISTS chats;

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL REFERENCES users(id),
    message VARCHAR(800),
    posted_data VARCHAR(400),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
