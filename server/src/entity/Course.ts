import { Field, ID, Int, ObjectType, Root } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment';

@Entity()
@ObjectType()
export class Course extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Field()
    @Column()
    department: string;

    @Field()
    @Column()
    number: string;

    @Field(() => [Int])
    @Column({ type: 'int', array: true })
    difficulty: number[] = [];

    @Field(() => Int, { nullable: true })
    averageDifficulty(@Root() parent: Course): number | null {
        if (parent.difficulty.length) {
            return (
                Math.round(
                    (parent.difficulty.reduce((a, b) => a + b) / parent.difficulty.length) * 10
                ) / 10
            );
        }
        return null;
    }

    @Field(() => [Int])
    @Column({ type: 'int', array: true })
    quality: number[] = [];

    @Field(() => Int, { nullable: true })
    averageQuality(@Root() parent: Course): number | null {
        if (parent.quality.length) {
            return (
                Math.round((parent.quality.reduce((a, b) => a + b) / parent.quality.length) * 10) /
                10
            );
        }
        return null;
    }

    @OneToMany(() => Comment, comment => comment.course)
    comments: Comment[];
}