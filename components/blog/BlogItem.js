import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const BlogItem = props => {
  let TouchableCmp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <Card style={styles.blog}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>
                {props.title}
              </Text>
              <Text style={styles.author}>
                {props.author}({props.publishedDate})
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode='tail'
                style={styles.content}
              >
                {props.content}
              </Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  blog: {
    height: 400,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    alignItems: 'center',
    height: '15%',
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
    padding: 5,
    height: 50,
  },
  content: {
    fontFamily: 'open-sans',
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 5,
  },
});

export default BlogItem;
