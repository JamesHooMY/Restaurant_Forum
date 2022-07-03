# Restaurant Forum
A restaurant forum application provides users to query, comment, add favorite, and like the restaurants they are interested in.

![03 07 2022_16 26 34_REC](https://user-images.githubusercontent.com/87403901/177049497-87961ee1-6a88-49cf-86ac-464945f7d919.gif)

***
# Start to use Restaurant Forum
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)

1.   Clone this project to your local place from github.

          git clone https://github.com/jameshoo123/Restaurant_Forum.git
    
2.   Move into the project directory on your local place.

          cd Restaurant_Forum
          
3.   Install NPM packages are nescessary for this service.

          npm install
    
4.   Create .env and add environment variables. (* Notice: The environment variables that need to be used are listed in .env.example !)

          touch .env
          
          
5.   Create MySQL database on [MySQL Workbench](https://dev.mysql.com/downloads/workbench/). (* Notice: Don't forget to install [MySQL](https://dev.mysql.com/downloads/mysql/) on your device !)
* MySQL database related settings can be found in [config.json](https://github.com/jameshoo123/Restaurant_Forum/blob/main/config/config.js).

         create database forum
         
![image](https://user-images.githubusercontent.com/87403901/177049737-066bd6eb-47e3-4ffa-b509-7876199a8488.png)

    
6.   MySQL database migration.

          npx sequelize db:migrate
    
7.   Add Seed data for test (* Notice: Seed data include 6 users(root, user1, user2, user3, user4, and user5) for testing.).

          npx sequelize db:seed:all
    
8.   Now you can start the service on your local device.

          node app.js
          
9.   Start exploring >>> [Restaurant Forum](http://localhost:3000/) <<< on your browser.

# Continue to develop Expense Tracker
*   Make sure that you have already installed [Node.js](https://nodejs.org/en/)
1.   Don't forget to install [nodemon](https://www.npmjs.com/package/nodemon) to make your development process smoother.
        
          npm install -g nodemon
    
2.   Now you can start the service on your local device.

          npm run dev
          
          or
          
          nodemon app.js
          
3.   Start exploring >>> [Expense Tracker](http://localhost:3000/) <<< on your browser.

***
## Seed user accounts for testing service
1.   This normal account can only login to the user service.
> Email: user1@example.com  
> Password: 12345678  

2.   This administrator account can login to the user and administrator service.
> Email: root@example.com  
> Password: 12345678  

***
# Features
1. Register your own account or using your facebook/google account directly to start create your expense list
2. All expenses will be summaried on the main page, you can edit or delete them.
3. Search the expenses by categories or months.
          
***
## Login page
![image](https://user-images.githubusercontent.com/87403901/177050566-b6873d13-12ca-4910-bae4-53d5b23fe5c7.png)

## Normal account
### Normal user's home page
![image](https://user-images.githubusercontent.com/87403901/177050524-4f5bc449-aedc-4800-961b-b0206b2454fe.png)

***
## Administrator account
### Administrator's home page
![image](https://user-images.githubusercontent.com/87403901/177050489-7a5d70f6-7d10-4f00-bf63-dbac977e049f.png)

### Administrator's Restaurants World Backend Management page
![image](https://user-images.githubusercontent.com/87403901/177050728-49776a24-fb7e-42dc-bf63-3e61f16d384f.png)

***
# Development tools
* Node.js 14.16.0
* Bootstrap 5.1.3
* popperjs 2.9.2
* Font-awesome 6.1.1
* MySQL 8.0.15

***
# Contributor
[jameshoo123](https://github.com/Azure/azure-content/blob/master/contributor-guide/contributor-guide-index.md)
