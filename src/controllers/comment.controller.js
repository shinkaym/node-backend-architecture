import { SuccessResponse } from '~/core/success.response'
import CommentService from '~/services/comment.service'

class CommentController {
  createComment = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'create new comment!',
      metadata: await CommentService.createComment(req.body)
    })
  }

  deleteComment = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'delete comment success!',
      metadata: await CommentService.deleteComment(req.body)
    })
  }

  getCommentsByParentId = async (req, res) => {
    SuccessResponse.send(res, {
      message: 'get comments!',
      metadata: await CommentService.getCommentsByParentId(req.query)
    })
  }
}

export const commentController = new CommentController