import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import { Field, InputType } from 'type-graphql'

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userid?: number }
  }
  res: Response
}

@InputType()
export class Input {
  @Field() username!: string
  @Field() password!: string
  @Field({ nullable: true }) nameid?: string
  @Field({ nullable: true }) photoid?: string
  @Field({ nullable: true }) bio?: string
}

@InputType()
export class Create {
  @Field() header!: string
  @Field() content!: string
  @Field(() => [String], { nullable: true }) tags?: string[]
  @Field({ defaultValue: false }) pinned?: boolean
}

@InputType()
export class Update {
  @Field() postid!: number
  @Field() header!: string
}

@InputType()
export class UpdateUser {
  @Field({ nullable: true }) nameid?: string
  @Field({ nullable: true }) photoid?: string
  @Field({ nullable: true }) bio?: string
}

@InputType()
export class UpdatePass {
  @Field() currPass!: string
  @Field() newPass!: string
}

@InputType()
export class Delete {
  @Field() nameid!: string
  @Field() postid!: number
}

@InputType()
export class CreateComment {
  @Field() content!: string
  @Field() postid!: number
}

@InputType()
export class UpdateComment {
  @Field() commentid!: number
  @Field() content!: string
}
