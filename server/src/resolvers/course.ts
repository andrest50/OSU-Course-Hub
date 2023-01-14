import { UserInputError } from 'apollo-server-express';
import { IsNumberString, Length } from 'class-validator';
import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { In } from 'typeorm';
import { logger } from '../logger';
import { Course } from '../entity/Course';
import { CourseProfessor } from '../entity/CourseProfessor';
import { Professor } from '../entity/Professor';
import { Departments, Terms } from '../util';

@InputType()
class CourseInput {
    @Field()
    department: string;

    @Field()
    @IsNumberString({ no_symbols: true }, { message: 'Class number must only contain numbers' })
    @Length(3, 3, { message: 'Class number must be 3 digits' })
    number: string;
}

@Resolver()
export class CourseResolver {
    @Query(() => [Course])
    async courses(): Promise<Course[]> {
        logger.info('Fetching list of courses');
        const courses = Course.find({});
        return courses;
    }

    @Query(() => Course)
    async course(@Arg('courseID') id: number): Promise<Course> {
        logger.info(`Fetching a single course with ID: ${id}`);
        const course = await Course.findOne({ where: { id: id } });
        if (!course) {
            logger.error(`Could not find course with given ID: ${id}`);
            throw new UserInputError(`Could not find course with given ID: ${id}`);
        }
        return course;
    }

    @Query(() => [Professor])
    async courseProfessors(@Arg('courseID') id: number): Promise<Professor[]> {
        logger.info('Fetching professors for a single course with ID: ', id);
        const courseProfessors = await CourseProfessor.find({ where: { courseID: id } });
        logger.debug('Course professors: ', courseProfessors);
        const professorIDs = courseProfessors.map(professor => professor.professorID);
        const professors = Professor.find({ where: { id: In(professorIDs) } });
        logger.debug('Professors: ', professors);
        return professors;
    }

    @Mutation(() => Course)
    async createCourse(@Arg('input') { department, number }: CourseInput): Promise<Course> {
        logger.info('Creating course with arguments: ', { department, number });
        if (Departments.indexOf(department) === -1) {
            logger.error(`Invalid department provided: ${department}`);
            throw new UserInputError(`Invalid department provided: ${department}`);
        }
        const duplicateCourse = await Course.findOne({ where: { department, number } });
        if (duplicateCourse) {
            logger.error(
                `Course with department ${department} and number ${number} already exists`
            );
            throw new UserInputError(
                `Course with department ${department} and number ${number} already exists`
            );
        }
        const course = await Course.create({ department, number }).save();
        logger.debug('Created new course: ', course);
        return course;
    }

    @Mutation(() => Course)
    async addProfessorToCourse(
        @Arg('professorID') professorID: number,
        @Arg('courseID') courseID: number,
        @Arg('termTaught') termTaught: string,
        @Arg('yearTaught') yearTaught: number
    ): Promise<Course> {
        logger.info(
            'Adding professor to course with arguments: ',
            professorID,
            courseID,
            termTaught,
            yearTaught
        );
        if (Terms.indexOf(termTaught) === -1) {
            logger.error(`Invalid term: ${termTaught}`);
            throw new UserInputError(`Invalid term: ${termTaught}`);
        }
        if (yearTaught.toString().length !== 4) {
            logger.error(`Invalid year: ${yearTaught}`);
            throw new UserInputError(`Invalid year: ${yearTaught}`);
        }
        const course = await Course.findOne({ where: { id: courseID } });
        const professor = await Professor.findOne({ where: { id: professorID } });
        if (!course) {
            logger.error(`Could not find course with given ID: ${courseID}`);
            throw new UserInputError(`Could not find course with given ID: ${courseID}`);
        }
        if (!professor) {
            logger.error(`Could not find professor with given ID: ${professorID}`);
            throw new UserInputError(`Could not find professor with given ID: ${professorID}`);
        }
        const duplicateCourseProfessor = await CourseProfessor.findOne({
            where: { courseID, professorID },
        });
        if (duplicateCourseProfessor) {
            logger.error(
                `Course with ID: ${courseID} taught by professor with ID: ${professorID} already exists`
            );
            throw new UserInputError(
                `Course with ID: ${courseID} taught by professor with ID: ${professorID} already exists`
            );
        }
        const courseProfessor = await CourseProfessor.create({
            courseID,
            professorID,
            termTaught,
            yearTaught,
        }).save();
        logger.debug('Created new course professor: ', courseProfessor);
        return course;
    }
}
