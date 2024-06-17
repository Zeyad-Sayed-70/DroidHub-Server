export class CreateCommentsDto {
  userId: string;
  postId: string;
  comment: string;
  replyToCommentId?: string;
}
