import { NotFoundError } from '~/core/error.response'
import CommentModel from '~/models/comment.model'
import { findProduct } from '~/models/repositories/product.repo'
import { convertToObjectIdMongodb } from '~/utils'

class CommentService {
  static async createComment({
    productId, userId, content, parentCommentId = null
  }) {
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })

    let rightValue

    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('parent comment not found')

      rightValue = parentComment.comment_right

      await CommentModel.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gte: rightValue }
      }, {
        $inc: { comment_right: 2 }
      })

      await CommentModel.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue }
      }, {
        $inc: { comment_left: 2 }
      })
    } else {
      const maxRightValue = await CommentModel.findOne({
        comment_productId: convertToObjectIdMongodb(productId)
      }, 'comment_right', { sort: { comment_right: -1 } })

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right
      } else {
        rightValue = 1
      }
    }

    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0
  }) {
    if (parentCommentId) {
      const parent = await CommentModel.findById(parentCommentId)
      if (!parent) throw new NotFoundError('Not found comment for product')

      const comments = await CommentModel.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right }
      }).select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1
      }).sort({ comment_left: 1 })

      return comments
    }

    const comments = await CommentModel.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId
    }).select({
      comment_left: 1,
      comment_right: 1,
      comment_content: 1,
      comment_parentId: 1
    }).sort({ comment_left: 1 })

    return comments
  }

  static async deleteComment({ commentId, productId }) {
    const foundProduct = await findProduct({
      product_id: productId
    })
    if (!foundProduct) throw new NotFoundError('product not found')

    const comment = await CommentModel.findById(commentId)
    if (!comment) throw new NotFoundError('comment not found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    const width = rightValue - leftValue + 1
    await CommentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    await CommentModel.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_right: { $gt: rightValue }
    }, {
      $inc: { comment_right: -width }
    })

    await CommentModel.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gt: rightValue }
    }, {
      $inc: { comment_left: -width }
    })

    return true
  }
}

export default CommentService