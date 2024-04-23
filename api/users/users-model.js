// build your `User` model here
const db = require('../../data/dbConfig');

function find() {
    return db("users");
}

function findById(id) {
    return db("users").where("users.id",id).first();
}

function findByUsername(username) {
    return db("users").where("username", username).first();
}

function add(user) {
    return db("users")
        .insert(user)
        .then(([id]) => findById(id));
}


module.exports = {find, findById, findByUsername, add}