import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { CommentResolver } from './resolvers/comment';
import { CourseResolver } from './resolvers/course';
import { ProfessorResolver } from './resolvers/professor';
import { StudentResolver } from './resolvers/student';
import { TextbookResolver } from './resolvers/textbook';
import { Comment } from './entity/Comment';
import { Course } from './entity/Course';
import { CourseProfessor } from './entity/CourseProfessor';
import { CourseTextbook } from './entity/CourseTextbook';
import { Professor } from './entity/Professor';
import { Student } from './entity/Student';
import { Textbook } from './entity/Textbook';

const main = async () => {
    dotenv.config();

    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: parseInt(<string>process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: 'OSU-Course-Hub',
        synchronize: true,
        entities: [Comment, Course, CourseProfessor, CourseTextbook, Professor, Student, Textbook],
    });
    dataSource
        .initialize()
        .then(() => {
            console.log('Data Source has been initialized!');
        })
        .catch(err => {
            console.error('Error during Data Source initialization', err);
        });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                CourseResolver,
                ProfessorResolver,
                StudentResolver,
                TextbookResolver,
                CommentResolver,
            ],
        }),
        context: ({ req, res }) => ({
            req,
            res,
        }),
    });

    const app = express();

    app.use(cors());

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
    });
};

main().catch(err => console.log(err));
