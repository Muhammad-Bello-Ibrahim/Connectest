import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  club?: mongoose.Types.ObjectId;
  tags?: string[];
  images?: string[];
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  shares: number;
  isPublic: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club"
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 50
    }],
    images: [{
      type: String,
      trim: true,
      maxlength: 255
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    shares: {
      type: Number,
      default: 0,
      min: 0
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    isPinned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Indexes for better performance
PostSchema.index({ createdAt: -1 });
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ club: 1, createdAt: -1 });
PostSchema.index({ isPublic: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: -1 });

// Virtual for comment count
PostSchema.virtual('commentCount').get(function() {
  return this.comments?.length || 0;
});

PostSchema.virtual('likeCount').get(function() {
  return this.likes?.length || 0;
});

// Ensure virtual fields are serialized
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

const Post = models?.Post || model<IPost>("Post", PostSchema);
const Comment = models?.Comment || model<IComment>("Comment", CommentSchema);

export { Post, Comment };