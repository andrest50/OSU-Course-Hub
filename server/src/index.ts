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
import { logger } from './logger';

const main = async () => {
    dotenv.config();

    const port = process.env.PORT || 5000;

    const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: parseInt(<string>process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: 'osucoursehub',
        synchronize: true,
        entities: [Comment, Course, CourseProfessor, CourseTextbook, Professor, Student, Textbook],
    });
    dataSource
        .initialize()
        .then(() => {
            logger.info('Data Source has been initialized!');
        })
        .catch(err => {
            logger.error('Error during Data Source initialization', err);
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

    app.listen(port, () => {
        logger.info(`Server started on port ${port}`);
    });
};

main().catch(err => logger.error(err));
