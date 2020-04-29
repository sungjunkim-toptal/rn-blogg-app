import {
  DELETE_BLOG,
  CREATE_BLOG,
  UPDATE_BLOG,
  SET_BLOGS,
  SET_USER_BLOGS,
} from '../actions/blogs';
import { AUTHENTICATE } from '../actions/auth';
import Blog from '../../models/blog';

const initialState = {
  blogs: [],
  userBlogs: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BLOGS:
      return {
        blogs: action.blogs,
        userBlogs: action.userBlogs,
      };
    case SET_USER_BLOGS:
      return {
        ...state,
        userBlogs: state.blogs.filter(blog => blog.authorId === action.userId),
      };
    case CREATE_BLOG:
      const newBlog = new Blog(
        action.blogData.id,
        action.blogData.authorId,
        action.blogData.author,
        action.blogData.title,
        action.blogData.imageUrl,
        action.blogData.content,
        new Date(action.blogData.publishedTime)
      );
      return {
        ...state,
        blogs: [newBlog].concat(state.blogs),
        userBlogs: [newBlog].concat(state.userBlogs),
      };
    case UPDATE_BLOG:
      const userBlogIndex = state.userBlogs.findIndex(
        blog => blog.id === action.blogId
      );
      const updatedBlog = new Blog(
        action.blogId,
        state.userBlogs[userBlogIndex].authorId,
        state.userBlogs[userBlogIndex].author,
        action.blogData.title,
        action.blogData.imageUrl,
        action.blogData.content,
        state.userBlogs[userBlogIndex].publishedDate
      );
      const updatedUserBlogs = [...state.userBlogs];
      updatedUserBlogs[userBlogIndex] = updatedBlog;
      const blogIndex = state.blogs.findIndex(
        blog => blog.id === action.blogId
      );
      const updatedBlogs = [...state.blogs];
      updatedBlogs[blogIndex] = updatedBlog;
      return {
        ...state,
        blogs: updatedBlogs,
        userBlogs: updatedUserBlogs,
      };
    case DELETE_BLOG:
      return {
        ...state,
        userBlogs: state.userBlogs.filter(blog => blog.id !== action.blogId),
        blogs: state.blogs.filter(blog => blog.id !== action.blogId),
      };
    case AUTHENTICATE:
      return {
        ...state,
        userBlogs: state.blogs.filter(blog => blog.authorId !== action.userId),
      };
    default:
      return state;
  }
  return state;
};
