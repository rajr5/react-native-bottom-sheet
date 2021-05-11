import Animated, { Easing } from 'react-native-reanimated';
import {
  KEYBOARD_BEHAVIOR,
  KEYBOARD_BLUR_BEHAVIOR,
  WINDOW_HEIGHT,
} from '../../constants';
import { exp } from '../../utilities/easingExp';

// default values
const DEFAULT_ANIMATION_EASING: Animated.EasingFunction = Easing.out(exp);
const DEFAULT_ANIMATION_DURATION = 500;
const DEFAULT_HANDLE_HEIGHT = 24;
const DEFAULT_OVER_DRAG_RESISTANCE_FACTOR = 2.5;
const DEFAULT_ENABLE_CONTENT_PANNING_GESTURE = true;
const DEFAULT_ENABLE_HANDLE_PANNING_GESTURE = true;
const DEFAULT_ENABLE_OVER_DRAG = true;
const DEFAULT_ENABLE_FLASH_SCROLLABLE_INDICATOR_ON_EXPAND = true;
const DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE = false;
const DEFAULT_ANIMATE_ON_MOUNT = false;
const DEFAULT_KEYBOARD_BEHAVIOR = KEYBOARD_BEHAVIOR.none;
const DEFAULT_KEYBOARD_BLUR_BEHAVIOR = KEYBOARD_BLUR_BEHAVIOR.none;

// initial values
const INITIAL_SNAP_POINT = -999;
const INITIAL_CONTAINER_HEIGHT = -999;
const INITIAL_HANDLE_HEIGHT = -999;
const INITIAL_POSITION = WINDOW_HEIGHT;

export {
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_OVER_DRAG_RESISTANCE_FACTOR,
  DEFAULT_ENABLE_CONTENT_PANNING_GESTURE,
  DEFAULT_ENABLE_HANDLE_PANNING_GESTURE,
  DEFAULT_ENABLE_OVER_DRAG,
  DEFAULT_ENABLE_FLASH_SCROLLABLE_INDICATOR_ON_EXPAND,
  DEFAULT_ENABLE_PAN_DOWN_TO_CLOSE,
  DEFAULT_ANIMATE_ON_MOUNT,
  DEFAULT_KEYBOARD_BEHAVIOR,
  DEFAULT_KEYBOARD_BLUR_BEHAVIOR,
  // initial
  INITIAL_POSITION,
  INITIAL_CONTAINER_HEIGHT,
  INITIAL_HANDLE_HEIGHT,
  INITIAL_SNAP_POINT,
};
