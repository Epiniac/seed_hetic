import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const IPHONE_16_WIDTH = 430; // iPhone 16 Pro Max width in pt
const SCALE = width / IPHONE_16_WIDTH;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FEFBFB',
    paddingTop: 60 * SCALE,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24 * SCALE,
    marginBottom: 32 * SCALE,
  },
  headerIcon: {
    width: 35 * SCALE,
    height: 35 * SCALE,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20 * SCALE,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitleSmall: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    color: '#000',
    fontWeight: '400',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 24 * SCALE,
    marginBottom: 0,
    gap: 0,
  },
  tabActive: {
    flex: 1,
    borderBottomWidth: 3 * SCALE,
    borderBottomColor: '#242833',
    paddingVertical: 8 * SCALE,
    alignItems: 'center',
  },
  tabActiveText: {
    color: '#242833',
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    fontSize: 13 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabInactive: {
    flex: 1,
    borderBottomWidth: 3 * SCALE,
    borderBottomColor: 'transparent',
    paddingVertical: 8 * SCALE,
    alignItems: 'center',
  },
  tabInactiveText: {
    color: '#7e8494',
    fontFamily: 'Avenir Next',
    fontWeight: '600',
    fontSize: 13 * SCALE,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tabSeparator: {
    height: 1 * SCALE,
    backgroundColor: '#d3d7e0',
    width: '92%',
    alignSelf: 'center',
    marginBottom: 18 * SCALE,
  },
  introText: {
    color: '#64748B',
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    textAlign: 'left',
    marginHorizontal: 24 * SCALE,
    marginBottom: 18 * SCALE,
  },
  inputGroupCustom: {
    width: '88%',
    alignSelf: 'center',
    marginBottom: 18 * SCALE,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8 * SCALE,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8 * SCALE,
    paddingRight: 0,
  },
  inputCustom: {
    flex: 1,
    height: 40 * SCALE,
    paddingHorizontal: 12 * SCALE,
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    color: '#222',
    backgroundColor: 'transparent',
  },
  subscribeButton: {
    backgroundColor: '#0F172A',
    borderRadius: 8 * SCALE,
    paddingVertical: 8 * SCALE,
    paddingHorizontal: 16 * SCALE,
    marginRight: 6 * SCALE,
    marginLeft: 4 * SCALE,
  },
  subscribeButtonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14 * SCALE,
  },
  inputHelp: {
    color: '#64748B',
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    marginBottom: 8 * SCALE,
    marginLeft: 2 * SCALE,
  },
  buttonContainerCustom: {
    alignItems: 'center',
    marginTop: 12 * SCALE,
    marginBottom: 24 * SCALE,
  },
  loginButtonCustom: {
    backgroundColor: '#1fb95c',
    paddingVertical: 14 * SCALE,
    paddingHorizontal: 60 * SCALE,
    borderRadius: 45 * SCALE,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78 * SCALE,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40 * SCALE,
    borderTopRightRadius: 40 * SCALE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  footerImage: {
    width: 60 * SCALE,
    height: 60 * SCALE,
  },


  // Catégories (CUSTOM & DEFAULT)
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 24 * SCALE,
    marginBottom: 18 * SCALE,
    gap: 24 * SCALE,
  },
  categoryCol: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 16 * SCALE,
    color: '#222',
    letterSpacing: 1,
    marginBottom: 6 * SCALE,
  },

  defaultCategoryContainer: {
    alignItems: 'center',
    marginTop: 20 * SCALE,
  },
  defaultCategoryText: {
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 18 * SCALE,
    color: '#222',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },


// En dessous Default

  grayText: {
    color: '#888',
    fontSize: 14 * SCALE,
    marginTop: 12 * SCALE,
    marginBottom: 24 * SCALE,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  inputGroup: {
    width: '80%',
    alignSelf: 'center',
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    color: '#222',
    marginBottom: 6 * SCALE,
    marginTop: 12 * SCALE,
    fontWeight: 'bold',
  },
  input: {
    height: 40 * SCALE,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8 * SCALE,
    paddingHorizontal: 12 * SCALE,
    marginBottom: 8 * SCALE,
    backgroundColor: '#fff',
    fontFamily: 'Inter',
    fontSize: 14 * SCALE,
    color: '#222',
  },

  // Bouton Connexion 
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40 * SCALE,
  },
  loginButton: {
    backgroundColor: '#27ae60', // vert
    paddingVertical: 14 * SCALE,
    paddingHorizontal: 60 * SCALE,
    borderRadius: 30 * SCALE,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontSize: 16 * SCALE,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})

export default styles;
