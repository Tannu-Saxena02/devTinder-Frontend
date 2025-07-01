# DevTinder
- Create a vite + React application
- Remove unnecessary code and create a Hello world app
- Install Tailwind CSS
- Install Daisy UI
- Add navbar component to App.jsx
- Create a Navbar.jsx seprate component file
- Install react router dom
- Create BrowserRouter > Routes > Route =/body >RouteChildren
- Create an outlet in a body component
- Create a footer
- Create a login Page
- Install axios
- CORS- Install cors in backend=>add middleware to with configuration: origin,credential:true
- Whenever you are making API call so pass axios=>{withCredentials:true}
- Install redux Toolkit + @reduxjs/toolkit - 
- configureStore =>Provider =>createSlice =>add reducer to store
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store
- Navbar should update as soon as user logs in
- Refactor our code to add constants file + create a components folder
- You cannot access other route without login
- if token is not present redirect user to login page
- logout feature
- Get the feed and add the feed in the store
- build the user card on feed
- Edit profile feature
- show toast message on edit of profile
- New page- see all my connections
- New page- see all my connection requests
- feature - Accept/reject connection request
- send ignore the user card from feed
- sign up new user
- E2E testing

Body
Navabar
Route=/=>feed
ROute=/login=>Login
Route=/connections=>Connections
Router=/profile=>Profile

TODO for frontend:
validation on field and add dropdown
Error handling on API frontend
Terms and condition -black page issue
Privacy policy page -black page issue
OTP screen and verify otp screen -timer 30sec & resend-30sec -black page issue
sendotp & verify & google api implementation 
success & error dialog show on otp send & on api error

Goggle auth Implementation


Drawer Implementation
front page for UI  (almost)
change and forgot password api & UI
Light & dark mode

beautify Ui and responsiveness
APP ICON and NAME (done)
AI Asistant for FAQ

 TODO backend:
validation and code correction backend(testing)
otp Send API & verify otp API (done)
: https://dev.to/manthanank/building-an-otp-verification-system-with-nodejs-and-mongodb-2p0o
- read about SMTP server and how it work with send mail
Goggle auth API (done)
deployment  (done)
payment gateway 
chat Feature. (done)

# Deployment
- we need a software to deploy our frontend application.it acts as webserver but we used to host frontend.it gives us http server
- nginx,AWS,how we manually deploy our application
# Deployment Steps :
- Singup on AWS
- Launch instance
- chmod 400 <secret>.pem
- ssh -i
- Install node version that currently in use
- Git clone
# Frontend
  - npm install -dependencies install
  - npm run build
  - sudo apt update
  - sudo apt install nginx
  - sudo systemctl start nginx
  - sudo systemctl enable nginx
  - copy code from dist(build files) to /var/www/html/
  -  sudo scp -r dist/* /var/www/html/
  - Enable port :80 of your instance
# Backend
 - Update DB password
 - allowed ec2 instance piblic IP on mongodb server
 - npm install pm2 -g
 - pm2 start npm --name "devTinder-backend" -- start
 - pm2 logs
 - pm2 list, pm2 flush <name>, pm2 stop <name>, pm2 delete<name>
 - config nginx - sudo nano /etc/nginx/sites-available/default
 - restart nginx - sudo systemctl restart nginx
 - Modify the BASEURL in frontend project to "/api"
# Nginx config
 server_name 13.49.241.157;
   location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
   }

Frontend:http://13.49.241.157/
backend:http://13.49.241.157:3000/
Domain name = devTinder.com = 13.49.241.157
Frontend = devTinder.com
backend = devTinder.com:3000/ => devTinder.com/api
try_files $uri $uri/ =404;

# Real time using WebSocket(Socket.io)
- Build the UI for a chat window on /chat/:targetUserId
- setup socket.io in backend
- npm i socket.io
- Setup frontend socket.io-client
- Initialise the chat
- createSocketConnection
- Listen to events
- Homework:improve the UI
- Homework: Fix the security Bug-auth in websockets
- Homework:fix bug:if I'm not friend then I should be able to send messages
   check userid same as logedinuserid,both userId,targetUserID are friends
- Homework: feat: Show Green sysmbol when online??? -[last seen 2 hour ago]
    connection established store timestamp
- Homework: Limit messages when fetching from DB(pagination)




diffulcities: online status,used redux in theme?

text-[14px] → applies on all screens (including mobile)

sm:text-[16px] → overrides on screens ≥ 640px (small devices & up)

md:text-[18px] → overrides on screens ≥ 768px (medium devices & up)

lg:text-[20px] → overrides on screens ≥ 1024px (large devices & up)