import { UserInputError } from 'apollo-server-express';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { logger } from '../logger';
import { Comment } from '../entity/Comment';
import { Student } from '../entity/Student';

@Resolver()
export class StudentResolver {
    @Query(() => [Student])
    async students(): Promise<Student[]> {
        logger.info(`Fetching list of students`);
        return Student.find({});
    }

    @Query(() => Student)
    async student(@Arg('ONID') ONID: string): Promise<Student> {
        logger.info(`Fetching student with ONID: ${ONID}`);
        const student = await Student.findOne({ where: { ONID } });
        if (!student) {
            logger.error(`Could not find student with given ONID: ${ONID}`);
            throw new UserInputError(`Could not find student with given ONID: ${ONID}`);
        }
        logger.info(`Student fetched: ${student}`);
        return student;
    }

    @Mutation(() => Student)
    async createStudent(@Arg('ONID') ONID: string): Promise<Student> {
        logger.info(`Creating a student with arguments: ${{ ONID: ONID }}`);
        const duplicateStudent = await Student.findOne({ where: { ONID } });
        if (duplicateStudent) {
            logger.error(`Student with ONID: ${ONID} already exists`);
            throw new UserInputError(`Student with ONID: ${ONID} already exists`);
        }
        const student = await Student.create({
            ONID,
            likedCommentIDs: [],
            dislikedCommentIDs: [],
        }).save();
        logger.debug(`Created new student: ${student}`);
        return student;
    }

    @Mutation(() => Comment)
    async likeComment(
        @Arg('ONID') ONID: string,
        @Arg('commentID') commentID: number
    ): Promise<Comment> {
        logger.info(`Liking a comment with arguments: ${{ CommentID: commentID, ONID: ONID }}`);
        const student = await Student.findOne({ where: { ONID } });
        const comment = await Comment.findOne({ where: { id: commentID } });
        if (!comment) {
            logger.error(`Could not find comment with given commentID: ${commentID}`);
            throw new UserInputError(`Could not find comment with given commentID: ${commentID}`);
        }

        if (!student) {
            logger.error(`Could not find student with given ONID: ${ONID}`);
            throw new UserInputError(`Could not find student with given ONID: ${ONID}`);
        }

        const idx1 = student.likedCommentIDs.indexOf(commentID);
        if (idx1 !== -1) {
            student.likedCommentIDs.splice(idx1);
            comment.likes -= 1;
        } else {
            student.likedCommentIDs.push(commentID);
            comment.likes += 1;
        }
        const idx2 = student.dislikedCommentIDs.indexOf(commentID);
        if (idx2 !== -1) {
            student.dislikedCommentIDs.splice(idx2);
            comment.dislikes -= 1;
        }

        await comment.save();
        await student.save();

        logger.debug(`Liked a comment with ID: ${commentID}`);
        return comment;
    }

    @Mutation(() => Comment)
    async dislikeComment(
        @Arg('ONID') ONID: string,
        @Arg('commentID') commentID: number
    ): Promise<Comment> {
        logger.info(`Disliking a comment with arguments: ${{ CommentID: commentID, ONID: ONID }}`);
        const student = await Student.findOne({ where: { ONID } });
        const comment = await Comment.findOne({ where: { id: commentID } });
        if (!comment) {
            logger.error(`Could not find comment with given commentID: ${commentID}`);
            throw new UserInputError(`Could not find comment with given commentID: ${commentID}`);
        }

        if (!student) {
            logger.error(`Could not find student with given ONID: ${ONID}`);
            throw new UserInputError(`Could not find student with given ONID: ${ONID}`);
        }

        const idx1 = student.dislikedCommentIDs.indexOf(commentID);
        if (idx1 !== -1) {
            student.dislikedCommentIDs.splice(idx1);
            comment.dislikes -= 1;
        } else {
            student.dislikedCommentIDs.push(commentID);
            comment.dislikes += 1;
        }

        const idx2 = student.likedCommentIDs.indexOf(commentID);
        if (idx2 !== -1) {
            student.likedCommentIDs.splice(idx2);
            comment.likes -= 1;
        }

        await comment.save();
        await student.save();

        logger.debug(`Disliked a comment with ID: ${commentID}`);
        return comment;
    }

    @Mutation(() => Boolean)
    async deleteStudent(@Arg('ONID') ONID: string): Promise<boolean> {
        logger.info(`Deleting student with arguments: ${{ ONID: ONID }}`);
        const student = await Student.findOne({ where: { ONID } });
        if (!student) {
            logger.error(`Could not find student with given ONID: ${ONID}`);
            throw new UserInputError(`Could not find student with given ONID: ${ONID}`);
        }
        await Student.delete({ ONID });
        logger.debug(`Deleted student with ONID: ${ONID}`);
        return true;
    }
}
