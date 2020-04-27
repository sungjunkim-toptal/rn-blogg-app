import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BlogsListScreen from '../screens/blog/BlogsListScreen';
import BlogDetailScreen from '../screens/blog/BlogDetailScreen';
import UserBlogsScreen from '../screens/user/UserBlogsScreen';
import EditBlogScreen from '../screens/user/EditBlogScreen';
import StartupScreen from '../screens/user/StartupScreen';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AuthScreen from '../screens/user/AuthScreen';
import * as authActions from '../store/actions/auth';

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const BlogsNavigator = createStackNavigator(
  {
    BlogList: BlogsListScreen,
    BlogDetail: BlogDetailScreen,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserBlogs: UserBlogsScreen,
    EditBlog: EditBlogScreen,
    Auth: AuthScreen,
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavigationOptions,
  }
);

const BlogDrawerNavigator = createDrawerNavigator(
  {
    'All Blogs': BlogsNavigator,
    'My Blogs': AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      const authData = useSelector(state => state.auth);

      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            {authData.token && (
              <Button
                title='Logout'
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                  props.navigation.toggleDrawer();
                }}
              />
            )}
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
  }
);
const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Blog: BlogDrawerNavigator,
});

export default createAppContainer(MainNavigator);
