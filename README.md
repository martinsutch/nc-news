# Northcoders News API

## Description

This is an API for the purpose of accessing application data programmatically.

**[Go to the live version of this API here!](https://nc-news-n3b4.onrender.com/api)**

Initial requests after inactivity may be delayed by 50 seconds or more while the service spins up. You can use a tool like [Insomina](https://insomnia.rest/download) to send requests to the server.

## Skills

1. **Backend & API Development**

    - **JavaScript, Node, Express, PostgreSQL**
    - **CRUD Operations:** Implementing Create, Read, Update, and Delete operations.
    - **RESTful API Design:** Structuring the API following REST principles.
    - **Error Handling:** Implementing proper error handling and validation in the API.
    - **Model View Controller:** Designing within MVC architecture for clear code organisation.
    - **Supabase and Render:** Hosting the application on a cloud platform.

2. **Testing & Code Quality**

    - **Test Driven Development:** Using tools including Jest and SuperTest to create rigorously tested code.
    - **Modular Code:** Writing reusable components and modular functions.

3. **Project Management & Version Control**

    - **GitHub:** Managing version control, including branching, merging, handling pull requests and review.
    - **Time Management:** Working within project time frames.
    - **Documentation:** Writing README files and other documentation to help users understand and use the app.

4. **Security**

    - **Environment Variables:** Using .env files to manage sensitive information like database credentials.
    - **Input Validation:** Ensuring data integrity and security by validating user inputs.

5. **Data Manipulation**

    - **FS/Promises:** Handling asynchronous API requests and file operations.
    - **JSON Handling:** Parsing and manipulating JSON data received from API requests.
    - **SQL Queries:** Writing complex queries to retrieve and manipulate data in PostgreSQL.

## Getting Started

If you wish to clone this project and run it locally, please do!

### Prerequisites

You'll need the following set up on your system:

-   [Node.js and NPM (Node Package Manager)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v6.0 or higher
-   [PostgreSQL](https://www.postgresql.org/download/) made using v14.12

### Installation

1. **Clone the Repository:**

    ```
    git clone https://github.com/martinsutch/news.git
    ```

    ```
    cd news
    ```

2. **Set Up Environment Variables:**

    This project requires certain environment variables to connect to the databases locally, witch are not included in the cloned repository. You can create these in the root of your project directory:

    ```
    echo "PGDATABASE=nc_news_test" > .env.test
    ```

    ```
    echo "PGDATABASE=nc_news" > .env.development
    ```

3. **Install NPM and Libraries:**

    ```
    npm install
    ```

4. **Create and Seed the Databases:**

    Create the databases:

    ```
    npm run setup-dbs
    ```

    Seed the databases:

    ```
    npm run seed
    ```

### Testing and Using the API

To run tests, use the following command:

```
npm run test
```

If you want to test the API endpoints provided by the server, you can use tools like [Insomina](https://insomnia.rest/download) or [Postman](https://www.postman.com/downloads/). These tools allow you to send HTTP requests to the server, view responses, and test the endpoints.

### Links

Find out more about the author of this project from [LinkedIn](https://www.linkedin.com/in/martinsutch/).

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

🦄
