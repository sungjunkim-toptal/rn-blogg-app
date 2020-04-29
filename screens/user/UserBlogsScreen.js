import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Button, StyleSheet, Alert, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import BlogItem from '../../components/blog/BlogItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as BlogsActions from '../../store/actions/blogs';

const UserBlogScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const userBlogs = useSelector(state => state.blogs.userBlogs);
  const authData = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
      setError(null);
    }
  }, [error]);

  const setUserBlogs = useCallback(() => {
    dispatch(BlogsActions.setUserBlogs());
  }, [BlogsActions]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      setUserBlogs();
    });

    return () => {
      willFocusSub.remove();
    };
  }, [setUserBlogs]);

  const editBlogHandler = id => {
    props.navigation.navigate('EditBlog', { blogId: id });
  };

  const deleteBlogHandler = async id => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(BlogsActions.deleteBlog(id));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const deleteHandler = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this blog?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          deleteBlogHandler(id);
        },
      },
    ]);
  };

  const addBlogHandler = useCallback(() => {
    if (!authData.token || authData.expiryTime < new Date().getTime()) {
      props.navigation.navigate('Auth');
    } else {
      props.navigation.navigate('EditBlog');
    }
  }, [authData]);

  useEffect(() => {
    props.navigation.setParams({ addNew: addBlogHandler });
  }, [addBlogHandler]);

  if (!authData.token || authData.expiryTime < new Date().getTime()) {
    return (
      <View style={styles.centered}>
        <Text>Please Login or Sign Up.</Text>
        <View style={styles.login}>
          <Button
            title='Login/Sign Up'
            color={Colors.primary}
            onPress={() => {
              props.navigation.navigate('Auth');
            }}
          />
        </View>
      </View>
    );
  }

  if (userBlogs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Blogs found. Start creating one?</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userBlogs}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <BlogItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          author={itemData.item.author}
          publishedDate={itemData.item.publishedDate.toLocaleString()}
          content={itemData.item.content}
          onSelect={() => {
            editBlogHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title='Edit'
            onPress={() => {
              editBlogHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title='Delete'
            onPress={() => {
              deleteHandler(itemData.item.id);
            }}
          />
        </BlogItem>
      )}
    />
  );
};

UserBlogScreen.navigationOptions = navData => {
  const addNewFn = navData.navigation.getParam('addNew');

  return {
    headerTitle: 'My Blogs',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Add'
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            addNewFn();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    marginTop: 10,
  },
});

export default UserBlogScreen;
