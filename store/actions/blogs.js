import * as FileSystem from 'expo-file-system';

import Blog from '../../models/blog';

export const DELETE_BLOG = 'DELETE_BLOG';
export const CREATE_BLOG = 'CREATE_BLOG';
export const UPDATE_BLOG = 'UPDATE_BLOG';
export const SET_BLOGS = 'SET_BLOGS';

export const fetchBlogs = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://rn-blog-app.firebaseio.com/blogs.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedBlogs = [];
      for (const key in resData) {
        loadedBlogs.push(
          new Blog(
            key,
            resData[key].authorId,
            'James',
            resData[key].title,
            resData[key].imageUrl,
            resData[key].content,
            new Date()
          )
        );
      }

      dispatch({
        type: SET_BLOGS,
        blogs: loadedBlogs,
        userBlogs: loadedBlogs.filter(blog => blog.authorId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteBlog = blogId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-blog-app.firebaseio.com/blogs/${blogId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({ type: DELETE_BLOG, blogId: blogId });
  };
};

export const createBlog = (title, imageUrl, content) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    if (imageUrl.startsWith('file:')) {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUrl,
        type: 'image/jpg',
        name: imageUrl.substr(imageUrl.lastIndexOf('/') + 1),
      });
      const uploadResponse = await fetch('http://wb.tinkhub.com:8000/cover', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Something went wrong(File upload)!');
      }
      const uploadResData = await uploadResponse.json();
      console.log(uploadResData);
      imageUrl = uploadResData.url;
    }
    const response = await fetch(
      `https://rn-blog-app.firebaseio.com/blogs.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: userId,
          title,
          imageUrl,
          content,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData);
      throw new Error('Something went wrong!');
    }

    const resData = await response.json();

    dispatch({
      type: CREATE_BLOG,
      blogData: {
        id: resData.name,
        authorId: userId,
        title,
        imageUrl,
        content,
      },
    });
  };
};

export const updateBlog = (id, title, imageUrl, content) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-blog-app.firebaseio.com/blogs/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          imageUrl,
          content,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_BLOG,
      blogId: id,
      blogData: { title, imageUrl, content },
    });
  };
};
