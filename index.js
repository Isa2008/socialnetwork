const express = require("express");
const app = express();
const db = require("./utils/db.js");
const { hash, compare } = require("./utils/bc");
const compression = require("compression");
const csurf = require("csurf");

//// SOCKET IO
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

//// COMPRESSION
app.use(compression());

//// EXPRESS
app.use(express.static("public"));
app.use(express.json());

//// COOKIE SESSION
const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 365.25 * 1000,
    secret:
        process.env.NODE_ENV == "production"
            ? process.env.SESS_SECRET
            : require("./secrets").sessionSecret
});

app.use(cookieSessionMiddleware);

//// SOCKET IO
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

//// BUNDLE SERVER
if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(
    express.urlencoded({
        extended: false
    })
);

//// CSURF
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//// FILE UPLOAD BOILERPLATE
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

//// MULTER
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//// WELCOME
app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//// REGISTER
app.post("/register", function(req, res) {
    if (req.body.password == "") {
        res.json({
            error: "error"
        });
    } else {
        hash(req.body.password)
            .then(hashed => {
                db.addRegister(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashed
                )
                    .then(result => {
                        req.session.userId = result;
                        res.json({ success: true });
                    })
                    .catch(error => {
                        console.log("error: ", error);
                        res.json({ success: false });
                    });
            })
            .catch(error => {
                console.log(
                    "error: ",
                    error
                );
                res.json({ success: false });
            });
    }
});

//// LOGIN
app.post("/login", function(req, res) {
    db.getLogin(req.body.email)
        .then(result => {
            compare(req.body.password, result[0].password)
                .then(match => {
                    if (match) {
                        req.session.loggedIn = true;
                        req.session.userId = result[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch(error => {
                    res.json({ success: false });
                });
        })
        .catch(error => {
            res.json({ success: false });
        });
});

//// GET USER'S PROFILE
app.get("/user", function(req, res) {
    db.getProfile(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log("Error while getting user's profile: ", error);
        });
});

//// UPLOAD USER'S PROFILE IMAGE
const s3 = require("./s3");
const config = require("./config");
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const imageurl = config.s3Url + filename;
    db.updateUserImage(req.session.userId, imageurl)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log("Error while uploading user's profile image: ", error);
        });
});

//// ADD USER'S BIO
app.post("/bio", function(req, res) {
    db.addBio(req.session.userId, req.body.bio)
        .then(resp => {
            res.json(resp.rows[0]);
        })
        .catch(error => {
            res.json({
                success: false
            });
        });
});

//// GET OTHER USER'S PROFILE
app.get("/users/:id", function(req, res) {
    db.getProfile(req.params.id)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log("Error while getting other user's profiles: ", error);
        });
});

//// FIND PEOPLE
app.get("/findpeople", function(req, res) {
    db.getUsers(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log("Error in finding other people: ", error);
        });
});

//// SEARCH PEOPLE BY NAME
app.get("/findsearch/:search", function(req, res) {
    db.getSearch(req.params.search)
        .then(result => {
            res.json(result.rows);
        })
        .catch(error => {
            console.log("Error in searching people by name: ", error);
        });
});

//// GET RELATION BETWEEN USERS
app.get("/relation/:friendId", function(req, res) {
    let objButton = [
        {
            text: "",
            fun: ""
        }
    ];
    db.getRelation(req.session.userId, req.params.friendId)
        .then(result => {
            if (result.length == 0) {
                objButton[0].text = "make friend request";
                objButton[0].fun = "makefriend";
                res.json(objButton);
            } else {
                if (result[0].accepted == true) {
                    objButton[0].text = "unfriend";
                    objButton[0].fun = "unfriend";
                    res.json(objButton);
                } else {
                    if (result[0].sender_id == req.session.userId) {
                        objButton[0].text = "cancel friend request";
                        objButton[0].fun = "cancelfriend";
                        res.json(objButton);
                    } else {
                        objButton[0].text = "accept friend request";
                        objButton[0].fun = "acceptfriend";
                        res.json(objButton);
                    }
                }
            }
        })
        .catch(error => {
            console.log("Error in getting user's relation: ", error);
        });
});

//// MAKE FRIEND REQUEST
app.post("/makefriend/:friendId", function(req, res) {
    let objButton = [
        {
            text: "",
            fun: ""
        }
    ];
    db.addFriend(req.params.friendId, req.session.userId, false)
        .then(result => {
            objButton[0].text = "cancel friend request";
            objButton[0].fun = "cancelfriend";
            res.json(objButton);
        })
        .catch(error => {
            console.log("Error in making friend request: ", error);
        });
});

//// CANCEL FRIEND REQUEST
app.post("/cancelfriend/:friendId", function(req, res) {
    let objButton = [
        {
            text: "",
            fun: ""
        }
    ];
    db.cancelFriend(req.params.friendId, req.session.userId)
        .then(result => {
            objButton[0].text = "make friend request";
            objButton[0].fun = "makeFriend";
            res.json(objButton);
        })
        .catch(error => {
            console.log("Error in canceling friend request: ", error);
        });
});

//// ACCEPT FRIEND REQUEST
app.post("/acceptfriend/:friendId", function(req, res) {
    let objButton = [
        {
            text: "",
            fun: ""
        }
    ];
    db.acceptFriend(req.params.friendId, req.session.userId, true)
        .then(result => {
            objButton[0].text = "unfriend";
            objButton[0].fun = "unfriend";
            res.json(objButton);
        })
        .catch(error => {
            console.log("Error in accepting friend request: ", error);
        });
});

//// ENDING FRIENDSHIP
app.post("/unfriend/:friendId", function(req, res) {
    let objButton = [
        {
            text: "",
            fun: ""
        }
    ];
    db.unFriend(req.params.friendId, req.session.userId, true)
        .then(result => {
            objButton[0].text = "make friend request";
            objButton[0].fun = "makefriend";
            res.json(objButton);
        })
        .catch(error => {
            console.log("Error in ending friendship: ", error);
        });
});

//// GET ALL USER'S FRIENDS
app.get("/friends/:get-all-friends.json", (req, res) => {
    db.getAllFriends(req.session.userId)
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.log(error);
            res.json({ success: false });
        });
});

//// LOGOUT
app.get("/logout", (req, res) => {
    // console.log("logout: ", req.session);
    req.session = null;
    res.redirect("/welcome");
});

//// THIS "*" ROUTE NEEDS TO BE THE LAST ROUTE AS IT TAKES ALL THE ROUTES PLUS INDEX.HTML
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//// SERVER 8080
server.listen(8080, function() {
    console.log("I'm listening.");
});

//// SERVER SIDE SOCKET IO
io.on("connection", function(socket) {
    // console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    let userId = socket.request.session.userId;

    db.getLastTenChatMessages()
        .then(data => {
            io.sockets.emit("getLastTenChatMessages", data);
        })
        .catch(error => {
            console.log(error);
        });

    socket.on("My amazing chat message", msg => {
        db.addMessages(userId, msg)
            .then(data => {
                // console.log("add the new message: ", msg);
                db.getProfile(userId)
                    .then(([data]) => {
                        io.sockets.emit("message from server", {
                            id: data.id,
                            first: data.first,
                            last: data.last,
                            imageurl: data.imageurl,
                            message: msg,
                            sender_id: data.sender_id
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(error => {
                console.log(error);
            });
    });
});
