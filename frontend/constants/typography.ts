import { Platform, TextStyle } from 'react-native'

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
})

export const typography: Record<string, TextStyle> = {
  display: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  displaySmall: {
    fontFamily,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  heading: {
    fontFamily,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  body: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  caption: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  button: {
    fontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
}
