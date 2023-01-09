import { UserInputError } from 'apollo-server-express';
import { MaxLength, MinLength } from 'class-validator';
import {
    Arg,
    Field,
    FieldResolver,
    InputType,
    Mutation,
    Query,
    Resolver,
    ResolverInterface,
} from 'type-graphql';
import { Course } from '../entity/Course';
import { CourseProfessor } from '../entity/CourseProfessor';
import { Professor } from '../entity/Professor';
import { Comment } from '../entity/Comment';
import { Colleges, Terms } from '../util';
import { In } from 'typeorm';

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
    //@FieldResolver()
    async professors(): Promise<Professor[]> {
        return Professor.find({});
    }

    @Query(() => Professor)
    //@FieldResolver()
    async professor(@Arg('professorID') id: number): Promise<Professor> {
        const professor = await Professor.findOne({ where: { id: id } });
        if (professor) {
            return professor;
        }
        throw new UserInputError('Validation error(s)', {
            validationErrors: { course: `Could not find professor with given ID: ${id}` },
        });
    }

    @Query(() => [Course])
    //@FieldResolver()
    async professorCourses(@Arg('professorID') id: number): Promise<Course[]> {
        const courses = await CourseProfessor.find({ where: { professorID: id } });
        const courseIDs = courses.map(course => course.courseID);
        return Course.findBy({ id: In(courseIDs) });
    }

    @Query(() => [Professor])
    //@FieldResolver()
    async highestRatedProfessors(): Promise<Professor[]> {
        const comments = await Comment.find({});
        const professorQualities: any = new Map();
        comments.forEach(({ professorID, quality }) => {
            if (professorID) {
                if (professorID in professorQualities) {
                    professorQualities[professorID].push(quality);
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
        return professors;
    }

    @Mutation(() => Professor)
    //@FieldResolver()
    async createProfessor(
        @Arg('input') { firstName, lastName, college }: ProfessorInput
    ): Promise<Professor> {
        const validationErrors: any = {};
        if (Colleges.indexOf(college) === -1) {
            validationErrors.college = `Invalid college: ${college}`;
        }
        const duplicateProfessor = await Professor.findOne({
            where: { firstName, lastName, college },
        });
        if (duplicateProfessor) {
            validationErrors.professor = `Professor with first name: ${firstName} and last name: ${lastName} in college ${college} already exists`;
        }
        if (Object.keys(validationErrors).length > 0) {
            throw new UserInputError('Validation error(s)', {
                validationErrors,
            });
        }
        const professor = await Professor.create({ firstName, lastName, college }).save();
        return professor;
    }

    @Mutation(() => Professor)
    //@FieldResolver()
    async addCourseToProfessor(
        @Arg('professorID') professorID: number,
        @Arg('courseID') courseID: number,
        @Arg('termTaught') termTaught: string,
        @Arg('yearTaught') yearTaught: number
    ): Promise<Professor> {
        const validationErrors: any = {};
        if (Terms.indexOf(termTaught) === -1) {
            validationErrors.term = `Invalid term: ${termTaught}`;
        }
        if (yearTaught.toString().length !== 4) {
            validationErrors.year = `Invalid year: ${yearTaught}`;
        }
        const course = await Course.findOne({ where: { id: courseID } });
        const professor = await Professor.findOne({ where: { id: professorID } });
        if (!course) {
            validationErrors.course = `Could not find course with given ID: ${courseID}`;
        }
        if (!professor) {
            validationErrors.professor = `Could not find professor with given ID: ${professorID}`;
        }
        const duplicateCourseProfessor = await CourseProfessor.findOne({
            where: { courseID, professorID },
        });
        if (duplicateCourseProfessor) {
            validationErrors.courseProfessor = `Course with ID: ${courseID} taught by professor with ID: ${professorID} already exists`;
        }
        if (Object.keys(validationErrors).length > 0 || !professor) {
            throw new UserInputError('Validation error(s)', {
                validationErrors,
            });
        }
        await CourseProfessor.create({
            courseID,
            professorID,
            termTaught,
            yearTaught,
        }).save();
        return professor;
    }
}
