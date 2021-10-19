import React from 'react';
import LiquidSwipe from './src/pages/LiquidSwipe';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const fonts = {
  "SFProDisplay-Bold": require("./assets/fonts/SF-Pro-Display-Bold.ttf"),
  "SFProDisplay-Regular": require("./assets/fonts/SF-Pro-Display-Regular.ttf"),
};

export default function App() {
  let [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <LiquidSwipe />

    );
  }
};
