const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/socialnetwork`);

exports.addRegister = function(first, last, email, password) {
    return db
        .query(
            `INSERT INTO users (first, last, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [first, last, email, password]
        )
        .then(({ rows }) => {
            return rows[0].id;
        });
};

exports.getLogin = function(email) {
    return db
        .query(
            `SELECT id, password
        FROM users
        WHERE email=$1`,
            [email]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getProfile = function(user) {
    return db
        .query(
            `SELECT first, last, imageurl, bio
            FROM users
            WHERE id=$1`,
            [user]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateUserImage = function(user, imageurl) {
    return db.query(
        `UPDATE users
            SET imageurl = $2
            WHERE users.id = $1
            RETURNING imageurl`,
        [user, imageurl]
    );
};

exports.addBio = function(user, bio) {
    return db.query(
        `UPDATE users
            SET bio = $2
            WHERE users.id = $1
            RETURNING bio`,
        [user, bio]
    );
};

exports.getUsers = function(id) {
    return db
        .query(
            `SELECT *
        FROM users
        WHERE id<>$1
        ORDER BY created_at DESC
        LIMIT 11`,[id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getSearch = function(val) {
    return db.query(
        `SELECT *
        FROM users
        WHERE first
        ILIKE $1;`,
        [val + "%"]
    );
};

exports.getRelation = function(receiver_id, sender_id) {
    return db
        .query(
            `SELECT *
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
            [receiver_id, sender_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addFriend = function(receiver_id, sender_id, accepted) {
    return db
        .query(
            `INSERT INTO friendships (receiver_id, sender_id, accepted)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [receiver_id, sender_id, accepted]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.cancelFriend = function(friendId, id) {
    return db
        .query(
            `DELETE FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
            [friendId, id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.acceptFriend = function(friendId, id, accepted) {
    return db
        .query(
            `UPDATE friendships
            SET accepted = $3
            WHERE (receiver_id = $1 AND sender_id = $2) OR (receiver_id = $2 AND sender_id = $1)`,
            [friendId, id, accepted]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.unFriend = function(sender_id, receiver_id) {
    return db
        .query(
            `DELETE FROM friendships
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (receiver_id = $2 AND sender_id = $1)`,
            [sender_id, receiver_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getAllFriends = function(id) {
    return db
        .query(
            `SELECT users.id, first, last, imageurl, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
            [id]
        )
        .then(data => {
            return data.rows;
        });
};

exports.addMessages = function(sender_id, message) {
    return db
        .query(
            `INSERT INTO chats (sender_id, message)
            VALUES ($1, $2)
            RETURNING id`,
            [sender_id, message]
        )
        .then(data => {
            return data.rows;
        });
};

exports.getLastTenChatMessages = function() {
    return db
        .query(
          `SELECT users.first, users.last, users.imageurl, chats.message, chats.sender_id
          FROM chats
          JOIN users
          ON (users.id = chats.sender_id)
          ORDER BY chats.created_at DESC
          LIMIT 10`,
        )
        .then(data => {
            return data.rows.reverse();
        });
};
