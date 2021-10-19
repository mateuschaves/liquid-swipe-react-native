import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedProps,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import MaskedView from "@react-native-community/masked-view";
import { clamp, vec, Vector } from "react-native-redash";

export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
export const MIN_LEDGE = 25;
export const MARGIN_WIDTH = MIN_LEDGE + 50;

// 0.5522847498 is taken from https://spencermortensen.com/articles/bezier-circle/

const AnimatedPath = Animated.createAnimatedComponent(Path);

const vec2 = (x: number, y: number) => {
  "worklet";
  return { x, y };
};
const curve = (c1: Vector, c2: Vector, to: Vector) => {
  "worklet";
  return `C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${to.x} ${to.y}`;
};

export enum Side {
  LEFT,
  RIGHT,
  NONE,
}

interface WaveProps {
  side: Side;
  children: ReactNode;
  position: Vector<Animated.SharedValue<number>>;
  isTransitioning: Animated.SharedValue<Boolean>;
}

const Wave = ({ side, children, position, isTransitioning }: WaveProps) => {
  const stepX = useDerivedValue(() => {
    const R = clamp(position.x.value, MARGIN_WIDTH - MIN_LEDGE, WIDTH / 3)
    return withSpring(isTransitioning.value ? 0 : R/2);
  })
  const animatedProps = useAnimatedProps(() => {
    const R = clamp(position.x.value, MARGIN_WIDTH - MIN_LEDGE, WIDTH / 3)
    const stepY = Math.max(position.x.value, MARGIN_WIDTH - MIN_LEDGE);
    const C = R * 0.5522847498;

    const p1 = vec2(position.x.value, position.y.value - 2 * stepY)
    const p2 = vec2(p1.x + stepX.value, p1.y + stepY)
    const p3 = vec2(p2.x + stepX.value, p2.y + stepY)
    const p4 = vec2(p3.x + stepX.value, p3.y + stepY)
    const p5 = vec2(p4.x + stepX.value, p4.y + stepY)

    const c21 = vec2(p1.x, p1.y  + C)
    const c22 = vec2(p2.x, p2.y)
    
    const c31 = vec2(p2.x, p2.y)
    const c32 = vec2(p3.x, p3.y - C)

    const c41 = vec2(p3.x, p3.y + C)
    const c42 = vec2(p3.x, p4.y)

    const c51 = vec2(p4.x, p4.y)
    const c52 = vec2(p5.x, p5.y - C)

    const d = [
      "M 0 0", 
      `H ${p1.x}`, 
      `V ${p1.y}`,
      curve(c21, c22, p2),
      curve(c31, c32, p3),
      curve(c41, c42, p4),
      curve(c51, c52, p5),
      `V ${HEIGHT}`,
      `H 0`, 
      "Z"
    ];

    return {
      d: d.join(" "),
    };
  });
  return (
    <MaskedView
      style={StyleSheet.absoluteFill}
      maskElement={
        <Svg style={(StyleSheet.absoluteFill, { transform: [{
          rotateY: side === Side.RIGHT ? '180deg' : '0deg',
        }] })}>
          <AnimatedPath animatedProps={animatedProps} fill="black" />
        </Svg>
      }
    >
      {children}
    </MaskedView>
  );
};

export default Wave;
