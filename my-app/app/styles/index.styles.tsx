import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
  },

  backgroundFull: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 340,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    zIndex: 2,
    borderRadius: 90,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    maxWidth: 320,
    alignSelf: 'center',
  },

  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 400,
    alignSelf: 'center',
  },

  boldGreen: {
    color: '#26CB66',
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#26CB66',
    borderRadius: 50,
    width: '90%',
    maxWidth: 340,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // Fond sombre et transparent
    zIndex: 1,
  },

});

export default styles;
