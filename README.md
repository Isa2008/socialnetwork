# Social Network

![Alt Text](demo-pics-gifs/network-register.png)

This site includes the basics of a social network. 
You can be part of *The Network* by registering with your name, email and password.
The project was made during my training at SPICED Academy Berlin. They provided me with a package.json.

# Tech Stack

It's a single-page application made with:

* HTML, CSS, Javascript, React/React Hooks, Redux, Socket.IO, Node.js, Express, Bundle.js, AWS/S3, Multer, PostgreSQL

       Including a database with three tables:
              - Users with firstname, lastname, email, password, profile-image, biography
              - Friendships with receiver, sender, accepted
              - Chats with sender, message, posted-data

## Demo Social Network

### My Profile

![Alt Text](demo-pics-gifs/edit-bio.gif)

On *my profile* you can upload your profile image and write your biography which both is always changeable.

![Alt Text](demo-pics-gifs/upload-profile-image.png)


### Find People

![Alt Text](demo-pics-gifs/find-people.png)
On *find people* you see recently joined users and you can find people by name, go to their profiles and send friend requests which your're always able to cancel.

![Alt Text](demo-pics-gifs/find-people.gif)

### My Friends

![Alt Text](demo-pics-gifs/accept-friend-request.gif)

On *my friends* page you see your friends and who wants to become your friend. You can accept friendships and also you're able to end the relation to friends. 

### Chat Room

![Alt Text](demo-pics-gifs/chat.png)

In the *chatroom* you can write messages to other users that can answer directly in time.

You can logout and login again at any time.
