import React from "react";
import { StyleSheet, View } from "react-native";

import Wave, { HEIGHT, MARGIN_WIDTH, Side, WIDTH } from "./Wave";
import Button from "./Button";

const PREV = WIDTH;
const NEXT = 0;

interface SliderProps {
  index: number;
  setIndex: (value: number) => void;
  children: JSX.Element;
  prev?: JSX.Element;
  next?: JSX.Element;
}

const Slider = ({
  index,
  children: current,
  prev,
  next,
  setIndex,
}: SliderProps) => {
  const hasPrev = !!prev;
  const hasNext = !!next;

  return (
    <View style={StyleSheet.absoluteFill}>
      {current}
      {prev && (
        <View style={[StyleSheet.absoluteFill]}>
          <Wave side={Side.LEFT}>{prev}</Wave>
        </View>
      )}
      {next && (
        <View style={StyleSheet.absoluteFill}>
          <Wave side={Side.RIGHT}>{next}</Wave>
        </View>
      )}
    </View>
  );
};

export default Slider;
