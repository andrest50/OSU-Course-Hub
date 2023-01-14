import { UserInputError } from 'apollo-server-express';
import { Max, Min } from 'class-validator';
import { Arg, Field, ID, InputType, Int, Mutation, Query, Resolver } from 'type-graphql';
import { In } from 'typeorm';
import { Course } from '../entity/Course';
import { CourseTextbook } from '../entity/CourseTextbook';
import { Textbook } from '../entity/Textbook';
import { Terms } from '../util';
import { logger } from '../logger';

@InputType()
class TextbookInput {
    @Field(() => ID)
    ISBN: string;

    @Field()
    title: string;

    @Field()
    author: string;

    @Field({ nullable: true })
    coverImageUrl?: string;

    @Field(() => Int)
    edition: number;

    @Field(() => Int)
    @Min(1000)
    @Max(9999)
    copyrightYear: number;

    @Field({ nullable: true })
    priceNewUSD?: number;

    @Field({ nullable: true })
    priceUsedUSD?: number;
}

@Resolver()
export class TextbookResolver {
    @Query(() => [Textbook])
    async courseTextbooks(@Arg('courseID') id: number): Promise<Textbook[]> {
        logger.info(`Fetching list of textbooks for course with arguments: ${{ CourseID: id }}`);
        const courseTextbooks = await CourseTextbook.find({ where: { courseID: id } });
        const textbookISBNs = courseTextbooks.map(textbook => textbook.ISBN);
        const textbooks = Textbook.find({ where: { ISBN: In(textbookISBNs) } });
        logger.debug(`Fetched list of textbooks: ${textbooks}`);
        return textbooks;
    }

    @Mutation(() => Textbook)
    async addTextbookToCourse(
        @Arg('input') input: TextbookInput,
        @Arg('courseID') courseID: number,
        @Arg('termUsed') termUsed: string,
        @Arg('yearUsed') yearUsed: number
    ): Promise<Textbook> {
        logger.info(
            `Adding textbook to course with arguments: ${{
                Input: input,
                CourseID: courseID,
                TermUsed: termUsed,
                YearUsed: yearUsed,
            }}`
        );
        if (Terms.indexOf(termUsed) === -1) {
            logger.error(`Invalid Term: ${termUsed}`);
            throw new UserInputError(`Invalid Term: ${termUsed}`);
        }
        if (yearUsed.toString().length !== 4) {
            logger.error(`Invalid Year: ${yearUsed}`);
            throw new UserInputError(`Invalid Year: ${yearUsed}`);
        }
        const duplicateTextbook = await CourseTextbook.findOne({
            where: { courseID, ISBN: input.ISBN },
        });
        if (duplicateTextbook) {
            logger.error(
                `Textbook with ISBN: ${input.ISBN} for course with ID: ${courseID} already exists`
            );
            throw new UserInputError(
                `Textbook with ISBN: ${input.ISBN} for course with ID: ${courseID} already exists`
            );
        }
        const course = await Course.findOne({ where: { id: courseID } });
        if (!course) {
            logger.error(`Could not find course with given ID: ${courseID}`);
            throw new UserInputError(`Could not find course with given ID: ${courseID}`);
        }
        let textbook = await Textbook.findOne({ where: { ISBN: input.ISBN } });
        if (!textbook) {
            textbook = await Textbook.create(Textbook).save();
            logger.debug(`Created new textbook: ${textbook}`);
        }
        const courseTextbook = await CourseTextbook.create({
            courseID,
            ISBN: input.ISBN,
            termUsed,
            yearUsed,
        }).save();
        logger.debug(`Added textbook to course: ${courseTextbook}`);
        return textbook;
    }
}
