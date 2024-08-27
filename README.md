# Northcoders News API

## Description

This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which provides this information to the front end architecture.

## Getting Started

If you wish to clone this project and run it locally, please do!

### Prerequisites

You'll need the following set up on your system:

-   [Node.js and NPM (Node Package Manager)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
-   [PostgreSQL](https://www.postgresql.org/download/)

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
