# OSU-Course-Hub

This is a web application for [Oregon State University](https://oregonstate.edu/) students to review courses and professors. It helps students get an idea of what a course or professor is like before selecting courses.

## Features

- Authenicate with your OSU ONID account
- Add new courses and professors
- Rate/comment on a course or professor
- Quickly search for any course or professor
- View overall ratings, tags, and comments for any course or professor

## Development

Both the server and client applications need to be running to use the web application. Run the server application  from the `server/` subdirectory using `npm start` and similarly run the client application from the `client/` subdirectory using `npm start`. Alternatively run each  application using `npm run dev` to have the applications automatically refresh after code changes, which preferable for development.

### Versions

- node v14.21.1
- npm v6.14.17

### File Structure

`client/` - the frontend, next.js client-side application

`server/` - the backend, node.js server-side application

### Environment Variables

The node.js application either requires these environment variables or requires an [ormconfig.json](https://typeorm.biunav.com/en/using-ormconfig.html#creating-a-new-connection-from-the-configuration-file) that specifies the database username and password.

```bash
# required if no ormconfig.json is configured
export DATABASE_USERNAME=...
export DATABASE_PASSWORD=...

# optional
export DATABASE_PORT=... # port for database server
export PORT=... # port for app server
```

### Technologies

Written in [Typescript](https://www.typescriptlang.org/).

- Frontend web framework: [React](https://reactjs.org/) ([next.js](https://nextjs.org/))
- Backend runtime: [Node.js](https://nodejs.org/en/)
- API server: [Apollo GraphQL](https://www.apollographql.com/docs/apollo-server/)
- Database: [PostgreSQL](https://www.postgresql.org/)
