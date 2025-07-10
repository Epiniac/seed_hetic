import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9F5FE',
    marginRight: 12,
  },
  textCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },

  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 24,
  },

  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  searchInputFake: {
    flex: 1,
    justifyContent: 'center',
    height: 32,
  },

  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  
  microIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },

  // Thrid content

  macetaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26CB66', // couleur douce bleutée
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: 390,
    height: 200,
  },

  macetaImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },

  macetaTextCol: {
    flex: 1,
    justifyContent: 'center',
  },

  macetaTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    maxWidth: '55%',
  },
  macetaSubtitle: {
    fontSize: 14,
    color: '#fff', // bleu doux
    maxWidth: '55%',

  },

  // Catégories Plantes 

  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 24,
    position: 'relative',
    height: 48, // hauteur fixe pour éviter le décalage
  },

  categoryCol: {
    alignItems: 'center',
    flex: 1,
  },

  categorySelected: {
    color: '#26CB66',
    fontSize: 15,
    marginBottom: 10,
  },

  categoryUnselected: {
    color: '#BDBDBD',
    fontSize: 15,
    marginBottom: 8,
  },

  categoryBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#26CB66',
  },

  imagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
  },

  imageCol: {
    alignItems: 'center',
    flex: 1,
  },

  plantImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginBottom: 8,
  },
  
  plantImageTitle: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
  },

});
