import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import Colors from '../../constants/Colors';
import HeaderButton from '../../components/UI/HeaderButton';

const BlogDetailScreen = props => {
  const blogId = props.navigation.getParam('blogId');
  const selectedBlog = useSelector(state =>
    state.blogs.blogs.find(blog => blog.id === blogId)
  );

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedBlog.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title='Share' onPress={() => {}} />
      </View>
      <View style={styles.details}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>
          {selectedBlog.title}
        </Text>
        <Text style={styles.author}>
          {selectedBlog.author}({selectedBlog.publishedDate.toDateString()})
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{selectedBlog.content}</Text>
      </View>
    </ScrollView>
  );
};

BlogDetailScreen.navigationOptions = navData => {
  return {
    title: navData.navigation.getParam('blogTitle'),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Share'
          iconName={
            Platform.OS === 'android' ? 'md-share-alt' : 'ios-share-alt'
          }
          onPress={() => {}}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    alignItems: 'center',
    margin: 5,
  },
  details: {
    alignItems: 'center',
    height: 80,
    padding: 5,
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  author: {
    fontFamily: 'open-sans-italic',
  },
  contentContainer: {
    marginHorizontal: 20,
  },
  content: {
    fontFamily: 'open-sans',
    fontSize: 15,
  },
});

export default BlogDetailScreen;
