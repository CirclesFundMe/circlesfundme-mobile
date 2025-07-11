import { isIphoneX } from 'react-native-iphone-x-helper';
import { Platform, StatusBar, Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

const deviceHeight = isIphoneX()
  ? height - 78 // iPhone X style SafeAreaView size in portrait
  : Platform.OS === 'android'
  ? height - StatusBar.currentHeight
  : height;

const responsiveHeight = (h) => {
  return height * (h / 100);
};

const responsiveWidth = (w) => {
  return width * (w / 100);
};

const RFValue = (fontSize) => {
  // guideline height for standard 5" device screen
  const standardScreenHeight = 680;
  const heightPercent = (fontSize * deviceHeight) / standardScreenHeight;
  return Math.round(heightPercent);
};

// utils/formatters.ts

export const formatAmount = (value) => {
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return `₦${num.toLocaleString()}`;
};

export const formatNumber = (value)=> {
  const num = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
  if (isNaN(num)) return "";
  return num.toLocaleString();
};

export const formattedAmount = (value) => {
  // Remove any non-numeric characters except for decimal points
  const cleanedValue = value.replace(/[^\d.]/g, '');

  // Convert to a number and format with commas
  const numberValue = parseFloat(cleanedValue);

  if (isNaN(numberValue)) return '₦0.00';

  return `₦${numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const roundNegativeTowardsZero = (num) => {
  return num < 0 ? 0 : num;
};

export const toTitleCase=(str)=> {
  return str?.replace(/\w\S*/g, function(txt) {
    return txt?.charAt(0)?.toUpperCase() + txt?.substr(1)?.toLowerCase();
  });
}

export const resFont = (val) => RFValue(val);
export const resHeight = (val) => responsiveHeight(val);

export const resWidth = (val) => responsiveWidth(val);

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const toNumber = (val) => parseFloat(val.replace(/,/g, "")) || 0;
