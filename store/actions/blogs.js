import * as FileSystem from 'expo-file-system';

import Blog from '../../models/blog';

export const DELETE_BLOG = 'DELETE_BLOG';
export const CREATE_BLOG = 'CREATE_BLOG';
export const UPDATE_BLOG = 'UPDATE_BLOG';
export const SET_BLOGS = 'SET_BLOGS';
export const SET_USER_BLOGS = 'SET_USER_BLOGS';

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
      // console.log(resData);i
      const loadedBlogs = [];
      for (const key in resData) {
        loadedBlogs.push(
          new Blog(
            key,
            resData[key].authorId,
            resData[key].author,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].content,
            new Date(resData[key].publishedTime)
          )
        );
      }
      loadedBlogs.sort(
        (a, b) => b.publishedDate.getTime() - a.publishedDate.getTime()
      );

      // console.log('userId : ' + userId);
      dispatch({
        type: SET_BLOGS,
        blogs: loadedBlogs,
        userBlogs: userId
          ? loadedBlogs.filter(blog => blog.authorId === userId)
          : [],
      });
    } catch (err) {
      throw err;
    }
  };
};

export const setUserBlogs = () => {
  return (dispatch, getState) => {
    const userId = getState().auth.userId;
    dispatch({
      type: SET_USER_BLOGS,
      userId: userId,
    });
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
    const userDisplayName = getState().auth.displayName;
    const publishedTime = new Date().getTime();
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
          author: userDisplayName,
          title,
          imageUrl,
          content,
          publishedTime,
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
        author: userDisplayName,
        title,
        imageUrl,
        content,
        publishedTime,
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
