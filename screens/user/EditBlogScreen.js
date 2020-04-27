import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as blogsActions from '../../store/actions/blogs';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import ImagePicker from '../../components/UI/ImagePicker';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      ...state,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

const EditBlogScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // const [selectedImage, setSelectedImage] = useState();

  const blogId = props.navigation.getParam('blogId');
  const editedBlog = useSelector(state =>
    state.blogs.userBlogs.find(blog => blog.id === blogId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedBlog ? editedBlog.title : '',
      imageUrl: editedBlog ? editedBlog.imageUrl : '',
      content: editedBlog ? editedBlog.content : '',
    },
    inputValidities: {
      title: editedBlog ? true : false,
      imageUrl: editedBlog ? true : false,
      content: editedBlog ? true : false,
    },
    fromIsValid: editedBlog ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
      setError(null);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input', 'Please check the errors', [{ text: 'Okay' }]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedBlog) {
        await dispatch(
          blogsActions.updateBlog(
            blogId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.content
          )
        );
      } else {
        await dispatch(
          blogsActions.createBlog(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.content
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
    props.navigation.goBack();
  }, [dispatch, blogId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const imageTakenHandler = imagePath => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: imagePath,
      isValid: true,
      input: 'imageUrl',
    });
    // setSelectedImage(imagePath);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'android' ? 'height' : 'padding'}
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Title'
            errorText='Please enter a valid title!'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedBlog ? editedBlog.title : ''}
            initiallyValid={!!editedBlog}
            required
          />
          <ImagePicker
            imageUrl={editedBlog ? editedBlog.imageUrl : ''}
            onImageTaken={imageTakenHandler}
          />
          <Input
            id='content'
            label='Content'
            errorText='Please enter a valid content!'
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedBlog ? editedBlog.content : ''}
            initiallyValid={!!editedBlog}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditBlogScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');

  return {
    headerTitle: navData.navigation.getParam('blogId')
      ? 'Edit Blog'
      : 'Add Blog',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Save'
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
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
  container: {
    flex: 1,
  },
  form: {
    margin: 20,
  },
});

export default EditBlogScreen;
