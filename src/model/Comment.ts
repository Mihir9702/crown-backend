import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'
import { Post } from './Post'
import { User } from './User'

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column({ type: 'text' })
  content!: string

  @Field(() => [Number], { nullable: true })
  @Column('text', { array: true, nullable: true })
  likes?: number[]

  @Field(() => User)
  @ManyToOne(() => User, user => user.comments)
  user!: User

  @Field(() => Post)
  @ManyToOne(() => Post, post => post.comments)
  post!: Post

  @Field(() => Number)
  @Column()
  commentid!: number

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date()
}
