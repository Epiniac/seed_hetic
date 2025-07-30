import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 32,
  },

  headerIcon: {
    width: 35,
    height: 35,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },

  title: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 36,
  },

  microIcon: {
    width: 36,
    height: 36,
    position: 'absolute',
    top: 50,
    left: 20,
  },
  
  illustrationContainer: {
    width: 320,
    height: 270,
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  illustration: {
    width: 320,
    height: 270,
    resizeMode: 'contain',
  },
  headline: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 19,
    color: '#242833',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 15,
    color: '#2e374d',
    textAlign: 'center',
    width: 327,
    lineHeight: 22,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1fb95c',
    borderRadius: 45,
    height: 45,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles; 