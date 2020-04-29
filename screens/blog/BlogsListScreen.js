import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Linking } from 'expo';

import BlogItem from '../../components/blog/BlogItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as blogsActions from '../../store/actions/blogs';

const useMount = func => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();

      // The setTimeout is just for testing purpose
      setTimeout(() => {
        setUrl(initialUrl);
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  });

  return { url, processing };
};

const BlogsListScreen = props => {
  const { url: initialUrl, processing } = useInitialURL();
  const [deepLinkProcessed, setDeepLinkProcessed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const blogs = useSelector(state => state.blogs.blogs);
  const dispatch = useDispatch();

  const loadBlogs = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await dispatch(blogsActions.fetchBlogs());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      loadBlogs();
    });

    return () => {
      willFocusSub.remove();
    };
  }, [loadBlogs]);

  useEffect(() => {
    setIsLoading(true);
    loadBlogs().then(() => setIsLoading(false));
  }, [loadBlogs]);

  const _handleRedirect = useCallback(event => {
    let data = Linking.parse(event.url);
    props.navigation.navigate('BlogDetail', {
      blogId: data.queryParams.id,
    });
  }, []);

  useEffect(() => {
    Linking.addEventListener('url', _handleRedirect);
  }, [_handleRedirect]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('BlogDetail', {
      blogId: id,
      blogTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title='Try again' onPress={loadBlogs} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && blogs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No blog found. Start adding some!</Text>
      </View>
    );
  }

  if (!isLoading && !processing && initialUrl && !deepLinkProcessed) {
    setDeepLinkProcessed(true);
    setTimeout(() => {
      let data = Linking.parse(initialUrl);
      if (data && data.queryParams && data.queryParams.id) {
        const blog = blogs.find(b => b.id === data.queryParams.id);
        props.navigation.navigate('BlogDetail', {
          blogId: data.queryParams.id,
        });
      }
    }, 800);
  }

  return (
    <FlatList
      onRefresh={loadBlogs}
      refreshing={isRefreshing}
      data={blogs}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <BlogItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          author={itemData.item.author}
          publishedDate={itemData.item.publishedDate.toLocaleString()}
          content={itemData.item.content}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title='Read full story!'
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
        </BlogItem>
      )}
    />
  );
};

BlogsListScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Blogs',
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
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BlogsListScreen;
