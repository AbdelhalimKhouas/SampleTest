/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {createBottomTabNavigator} from "react-navigation";
import { Icon } from "native-base";
import BookmarkedScreen from './screens/BookmarkedScreen';
import HomeScreen from './screens/HomeScreen';

export default createBottomTabNavigator(
  {
    Bookmarked: BookmarkedScreen,
    Home: HomeScreen
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = "home";
        }  else if (routeName === "Bookmarked") {
          iconName = "heart";
        }
        return (
          <Icon name={iconName} style={{ fontSize: 25, color: tintColor }} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#08d4fc",
      inactiveTintColor: "gray",
      showLabel: false
    },
    initialRouteName: "Home"
  }
);