import { StyleSheet, Dimensions } from "react-native";
import colors from "../assets/constants/colors";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export const height = screenHeight < screenWidth ? screenWidth : screenHeight;
export const width = screenWidth < screenHeight ? screenWidth : screenHeight;

const { flatten, create } = StyleSheet;

const template = create({
  container: {
    flex:1,
    backgroundColor: colors.white,
  },
  justifyCenter: {
    justifyContent: 'center'
  },
  alignCenter: {
    alignItems: 'center'
  },
  overlayBackground: {
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  absolutePosition: {
    position: 'absolute',
  }
});

const styles = create({
  container: flatten(template.container),
  centerContainer: flatten([template.container,template.justifyCenter,template.alignCenter]),
  logo: {
    height: height * 0.25,
    width: width * 0.9
  },
  opacityModal: flatten([template.container, template.overlayBackground]),
  filterList: flatten([
    template.container,
    {
      width:'100%',
      alignSelf: 'center',
    }
  ]),
  absoluteModal: flatten([template.absolutePosition, template.container, {
    width: '100%',
    backgroundColor: 'transparent'
  }]),
  calloutTip: {
    zIndex: 1000,
    marginTop: -2,
    elevation: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 16,
    borderRightWidth: 8,
    borderBottomWidth: 0,
    borderLeftWidth: 8,
    borderTopColor: 'white',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  calloutContent: {
    padding: 8,
    flex: 1,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
  },
  calloutContainer : {
    alignItems: 'center',
    justifyContent: 'center',
    width: 180,
    zIndex: 9999999,
  }
});

export default styles;