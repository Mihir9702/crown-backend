import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Post } from './Post'
import { Comment } from './Comment'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  username!: string

  @Field(() => String)
  @Column({ type: 'text' })
  password!: string

  @Field(() => String)
  @Column({ type: 'text', unique: true })
  nameid!: string

  @Field(() => Number)
  @Column({ unique: true })
  userid!: number

  @Field({ defaultValue: process.env.DEFAULT_IMG, nullable: true })
  @Column({ default: process.env.DEFAULT_IMG, nullable: true })
  photoid!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  bio?: string

  @Field(() => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  likes!: number

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, post => post.user)
  posts?: Post[]

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, comments => comments.user)
  comments?: Comment[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt?: Date = new Date()

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt?: Date = new Date()
}
