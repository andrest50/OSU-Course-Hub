import { UserInputError } from 'apollo-server-express';
import { Max, MaxLength, Min } from 'class-validator';
import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Comment } from '../entity/Comment';
import { Course } from '../entity/Course';
import { Professor } from '../entity/Professor';
import { Student } from '../entity/Student';
import { Campuses, Grades, Tags } from '../util';
import { logger } from '../logger';

@InputType()
class CommentInput {
    @Field({ nullable: true })
    anonymous?: boolean;

    @Field()
    @MaxLength(524)
    text: string;

    @Field(() => Int)
    @Min(1)
    @Max(5)
    difficulty: number;

    @Field(() => Int)
    @Min(1)
    @Max(5)
    quality: number;

    @Field()
    ONID: string;

    @Field({ nullable: true })
    professorID?: number;

    @Field({ nullable: true })
    courseID?: number;

    @Field({ nullable: true })
    campus?: string;

    @Field({ nullable: true })
    recommend?: boolean;

    @Field({ nullable: true })
    baccCore?: boolean;

    @Field({ nullable: true })
    gradeReceived?: string;

    @Field(() => [String])
    tags: string[];
}

@Resolver()
export class CommentResolver {
    @Query(() => [Comment])
    async comments(): Promise<Comment[]> {
        logger.info('Fetching list of comments');
        const comments = await Comment.find({});
        return comments.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }

    @Query(() => [Comment])
    async courseComments(@Arg('courseID') id: number): Promise<Comment[]> {
        logger.info(`Fetching list of comments for course with arguments: ${{ CourseID: id }}`);
        const comments = await Comment.find({});
        return comments
            .filter(comment => comment.courseID === id)
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }

    @Query(() => [Comment])
    async professorComments(@Arg('professorID') id: number): Promise<Comment[]> {
        logger.info(
            `Fetching list of comments for professor with arguments: ${{ ProfessorID: id }}`
        );
        const comments = await Comment.find({});
        return comments
            .filter(comment => comment.professorID === id)
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }

    @Query(() => [Comment])
    async studentComments(@Arg('ONID') ONID: string): Promise<Comment[]> {
        logger.info(`Fetching list of comments by student with arguments: ${{ ONID: ONID }}`);
        const comments = await Comment.find({});
        return comments
            .filter(comment => comment.ONID === ONID)
            .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    }

    // TODO: clean up logic
    @Mutation(() => Comment)
    async createComment(
        @Arg('input')
        {
            anonymous,
            text,
            difficulty,
            quality,
            ONID,
            professorID,
            courseID,
            campus,
            recommend,
            baccCore,
            gradeReceived,
            tags,
        }: CommentInput
    ): Promise<Comment> {
        logger.info(
            `Creating comment with arguments: ${{
                ONID: ONID,
                ProfessorID: professorID,
                CourseID: courseID,
            }}`
        );
        const student = await Student.findOne({ where: { ONID } });
        if (!student) {
            logger.error(`Could not find student with given ONID: ${ONID}`);
            throw new UserInputError(`Could not find student with given ONID: ${ONID}`);
        }
        if (campus && Campuses.indexOf(campus) === -1) {
            logger.error(`Invalid campus: ${campus}`);
            throw new UserInputError(`Invalid campus: ${campus}`);
        }
        if (gradeReceived && Grades.indexOf(gradeReceived) === -1) {
            logger.error(`Invalid grade: ${gradeReceived}`);
            throw new UserInputError(`Invalid grade: ${gradeReceived}`);
        }
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                if (Tags.indexOf(tags[i]) === -1) {
                    logger.error(`Invalid tag: ${tags[i]}`);
                    throw new UserInputError(`Invalid tag: ${tags[i]}`);
                }
            }
        }
        if (professorID) {
            const professor = await Professor.find({ where: { id: professorID } });
            if (professor) {
                const comment = await Comment.create({
                    anonymous,
                    text,
                    difficulty,
                    quality,
                    ONID,
                    professorID,
                    campus,
                    recommend,
                    baccCore,
                    gradeReceived,
                    tags,
                    likes: 0,
                    dislikes: 0,
                }).save();
                logger.debug(`Created new comment: ${comment}`);
                return comment;
            }
            logger.error(`Could not find professor with given ID: ${professorID}`);
            throw new UserInputError(`Could not find professor with given ID: ${professorID}`);
        }
        const course = await Course.find({ where: { id: courseID } });
        if (course) {
            const comment = await Comment.create({
                anonymous,
                text,
                difficulty,
                quality,
                ONID,
                courseID,
                campus,
                recommend,
                baccCore,
                gradeReceived,
                tags,
                likes: 0,
                dislikes: 0,
            }).save();
            logger.debug(`Created new comment: ${comment}`);
            return comment;
        }
        logger.error(`Could not find course with given ID: ${courseID}`);
        throw new UserInputError(`Could not find course with given ID: ${courseID}`);
    }

    @Mutation(() => Boolean)
    async deleteComment(@Arg('commentID') id: number): Promise<boolean> {
        const comment = await Comment.find({ where: { id } });
        if (!comment) {
            logger.error(`Could not find comment with given ID: ${id}`);
            throw new UserInputError(`Could not find comment with given ID: ${id}`);
        }
        await Comment.delete({ id });
        return true;
    }
}
