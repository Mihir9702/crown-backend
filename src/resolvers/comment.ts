import 'dotenv/config'
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
} from 'type-graphql'
import { CreateComment, MyContext, UpdateComment } from '../types'
import { isAuth } from '../middleware/isAuth'
import { User } from '../model/User'
import { Comment } from '../model/Comment'
import { randomNumber } from '../helpers/rand'
import { Post } from '../model/Post'

@Resolver()
export class CommentResolver {
  @Query(() => [Comment])
  async comments(@Arg('postid') postid: number): Promise<Comment[] | null> {
    return await Post.findOne({
      where: { postid },
      relations: ['user', 'post'],
    }).then(post => post?.comments!)
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg('params') params: CreateComment,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    const user = await User.findOne({
      where: { userid: req.session.userid },
      relations: ['posts', 'comments'],
    })
    if (!user) throw new Error('[CC] - no user')

    const commentid = randomNumber(4)
    return await Comment.create({ ...params, user, commentid }).save()
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg('params') params: UpdateComment,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    if (!req.session.userid) throw new Error('[UC] - No session id')

    const comment = await Comment.findOne({
      where: { commentid: params.commentid },
      relations: ['user', 'post'],
    })

    const user = await User.findOne({
      where: { userid: req.session.userid },
    })

    if (!user) throw new Error('[UC] - No user found')
    else if (!comment) throw new Error('[UC] - No comment found')
    else if (comment.user !== user)
      throw new Error('[UC] - user did not create comment')

    comment.content = params.content

    return await Comment.save(comment)
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async likeComment(
    @Arg('commentid') commentid: number,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    if (!req.session.userid) throw new Error('[LC] - No session id')

    const comment = await Comment.findOne({
      where: { commentid },
      relations: ['user', 'post'],
    })
    if (!comment) throw new Error('[LC] - No comment found')

    if (!comment.likes) comment.likes = [req.session.userid]
    else comment.likes.push(req.session.userid)
    console.log('[LC] - comment.likes', comment.likes)

    comment.user.likes += 1

    await User.save(comment.user)
    return await Comment.save(comment)
  }

  @Mutation(() => Comment)
  @UseMiddleware(isAuth)
  async unlikeComment(
    @Arg('commentid') commentid: number,
    @Ctx() { req }: MyContext
  ): Promise<Comment> {
    if (!req.session.userid) throw new Error('[ULC] - Please log in')

    const comment = await Comment.findOne({
      where: { commentid },
      relations: ['user', 'post'],
    })
    if (!comment) throw new Error('[ULC] - No comment found')

    const idx = comment.likes?.indexOf(req.session.userid)

    if (idx) {
      comment.likes?.splice(idx, 1)
    }

    comment.user.likes -= 1

    await User.save(comment.user)
    return await Comment.save(comment)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg('commentid') commentid: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const comment = await Comment.findOne({
      where: { commentid },
      relations: ['user', 'post'],
    })
    const user = await User.findOne({ where: { userid: req.session.userid } })

    if (!comment || !user) throw new Error('[DC] - no post or user found')
    else if (comment.user !== user) return false

    await Comment.remove(comment)
    return true
  }
}
