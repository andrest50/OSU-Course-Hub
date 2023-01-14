import { UserInputError } from 'apollo-server-express';
import { MaxLength, MinLength } from 'class-validator';
import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { In } from 'typeorm';
import { Course } from '../entity/Course';
import { CourseProfessor } from '../entity/CourseProfessor';
import { Professor } from '../entity/Professor';
import { Comment } from '../entity/Comment';
import { Colleges } from '../util';
import { logger } from '../logger';

@InputType()
class ProfessorInput {
    @Field()
    @MinLength(1, { message: 'First name cannot be blank' })
    @MaxLength(255, { message: 'First name cannot be longer than 255 characters' })
    firstName: string;

    @Field()
    @MinLength(1, { message: 'Last name cannot be blank' })
    @MaxLength(255, { message: 'Last name cannot be longer than 255 characters' })
    lastName: string;

    @Field()
    college: string;
}

@Resolver(() => Professor)
export class ProfessorResolver {
    @Query(() => [Professor])
    async professors(): Promise<Professor[]> {
        logger.info('Fetching list of professors');
        return Professor.find({});
    }

    @Query(() => Professor)
    async professor(@Arg('professorID') id: number): Promise<Professor> {
        logger.info(`Fetching professor with ID: ${id}`);
        const professor = await Professor.findOne({ where: { id: id } });
        if (!professor) {
            logger.error(`Could not find professor with given ID: ${id}`);
            throw new UserInputError(`Could not find professor with given ID: ${id}`);
        }
        return professor;
    }

    @Query(() => [Course])
    async professorCourses(@Arg('professorID') id: number): Promise<Course[]> {
        logger.info(`Fetching list of courses taught by a professor with ID: ${id}`);
        const courses = await CourseProfessor.find({ where: { professorID: id } });
        const courseIDs = courses.map(course => course.courseID);
        return Course.findBy({ id: In(courseIDs) });
    }

    @Query(() => [Professor])
    async highestRatedProfessors(): Promise<Professor[]> {
        logger.info(`Fetching highest rated professors`);
        const comments = await Comment.find({}); // TODO: Rework logic, this is inefficient
        const professorQualities: any = new Map();
        comments.forEach(({ professorID, quality }) => {
            if (professorID) {
                if (professorID in professorQualities) {
                    professorQualities.get(professorID).push(quality);
                } else {
                    professorQualities[professorID] = [quality];
                }
            }
        });
        const professorQualitiesArr: [number, number][] = [];
        Object.keys(professorQualities).forEach(id => {
            const avgQuality =
                professorQualities[id].reduce((a: number, b: number) => a + b) /
                professorQualities[id].length;
            professorQualitiesArr.push([parseInt(id), avgQuality]);
        });
        professorQualitiesArr.sort((a, b) => b[1] - a[1]);
        const topFiveRatedProfessors: number[] = [];
        for (let i = 0; i < Math.min(5, professorQualitiesArr.length); i++) {
            topFiveRatedProfessors.push(professorQualitiesArr[i][0]);
        }
        const professors = await Professor.findBy({ id: In(topFiveRatedProfessors) });
        logger.debug(`Fetched highest rated professors: ${professors}`);
        return professors;
    }

    @Mutation(() => Professor)
    async createProfessor(
        @Arg('input') { firstName, lastName, college }: ProfessorInput
    ): Promise<Professor> {
        logger.info(`Creating a professor with arguments: ${{ firstName, lastName, college }}`);
        if (Colleges.indexOf(college) === -1) {
            logger.error(`Invalid college: ${college}`);
            throw new UserInputError(`Invalid college: ${college}`);
        }
        const duplicateProfessor = await Professor.findOne({
            where: { firstName, lastName, college },
        });
        if (duplicateProfessor) {
            logger.error(
                `Professor with first name: ${firstName} and last name: ${lastName} in college ${college} already exists`
            );
            throw new UserInputError(
                `Professor with first name: ${firstName} and last name: ${lastName} in college ${college} already exists`
            );
        }
        const professor = await Professor.create({ firstName, lastName, college }).save();
        logger.debug(`Created new professor: ${professor}`);
        return professor;
    }
}
