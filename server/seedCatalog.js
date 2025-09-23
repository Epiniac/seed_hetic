const mongoose = require('mongoose');
const PlantCatalog = require('./models/PlantCatalog');
require('dotenv').config();

const samplePlants = [
  {
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    description: "Une plante d'intérieur populaire avec de grandes feuilles trouées. Parfaite pour les débutants en jardinage d'intérieur.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300",
    category: "intérieur",
    difficulty: "facile",
    sunlight: "moyenne",
    growthRate: "moyenne",
    tags: ["intérieur", "débutant", "air purifiant"],
    careInstructions: {
      watering: {
        frequency: "weekly",
        amount: "moderate"
      },
      temperature: {
        min: 18,
        max: 27,
        optimal: 22
      },
      humidity: {
        min: 40,
        max: 80,
        optimal: 60
      }
    },
    isPublic: true
  },
  {
    name: "Ficus Lyrata",
    species: "Ficus lyrata",
    description: "Le figuier lyre est une plante d'intérieur élégante avec de grandes feuilles en forme de violon. Nécessite une lumière vive indirecte.",
    image: "https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=300",
    category: "intérieur",
    difficulty: "moyen",
    sunlight: "forte",
    growthRate: "lente",
    tags: ["intérieur", "décoratif", "élégant"],
    careInstructions: {
      watering: {
        frequency: "bi-weekly",
        amount: "moderate"
      },
      temperature: {
        min: 16,
        max: 24,
        optimal: 20
      },
      humidity: {
        min: 40,
        max: 60,
        optimal: 50
      }
    },
    isPublic: true
  },
  {
    name: "Pothos Doré",
    species: "Epipremnum aureum",
    description: "Une plante grimpante facile d'entretien avec des feuilles panachées dorées. Excellente pour purifier l'air.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300",
    category: "intérieur",
    difficulty: "facile",
    sunlight: "faible",
    growthRate: "rapide",
    tags: ["intérieur", "grimpant", "air purifiant", "facile"],
    careInstructions: {
      watering: {
        frequency: "weekly",
        amount: "light"
      },
      temperature: {
        min: 15,
        max: 30,
        optimal: 22
      },
      humidity: {
        min: 30,
        max: 70,
        optimal: 50
      }
    },
    isPublic: true
  },
  {
    name: "Sansevieria",
    species: "Sansevieria trifasciata",
    description: "Aussi appelée 'langue de belle-mère', cette plante succulente est très résistante et nécessite peu d'entretien.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=300",
    category: "intérieur",
    difficulty: "facile",
    sunlight: "faible",
    growthRate: "lente",
    tags: ["intérieur", "succulent", "résistant", "air purifiant"],
    careInstructions: {
      watering: {
        frequency: "monthly",
        amount: "minimal"
      },
      temperature: {
        min: 12,
        max: 30,
        optimal: 21
      },
      humidity: {
        min: 20,
        max: 50,
        optimal: 35
      }
    },
    isPublic: true
  },
  {
    name: "Basilic",
    species: "Ocimum basilicum",
    description: "Herbe aromatique populaire en cuisine. Facile à cultiver en intérieur avec suffisamment de lumière.",
    image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300",
    category: "aromatique",
    difficulty: "facile",
    sunlight: "forte",
    growthRate: "rapide",
    tags: ["aromatique", "cuisine", "comestible", "intérieur"],
    careInstructions: {
      watering: {
        frequency: "daily",
        amount: "light"
      },
      temperature: {
        min: 20,
        max: 25,
        optimal: 23
      },
      humidity: {
        min: 50,
        max: 70,
        optimal: 60
      }
    },
    isPublic: true
  },
  {
    name: "Menthe",
    species: "Mentha",
    description: "Plante aromatique rafraîchissante, parfaite pour les tisanes et la cuisine. Croissance rapide.",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=300",
    category: "aromatique",
    difficulty: "facile",
    sunlight: "moyenne",
    growthRate: "rapide",
    tags: ["aromatique", "cuisine", "tisane", "rafraîchissant"],
    careInstructions: {
      watering: {
        frequency: "daily",
        amount: "moderate"
      },
      temperature: {
        min: 15,
        max: 25,
        optimal: 20
      },
      humidity: {
        min: 40,
        max: 80,
        optimal: 60
      }
    },
    isPublic: true
  },
  {
    name: "Tomate Cerise",
    species: "Solanum lycopersicum var. cerasiforme",
    description: "Variété de tomate produisant de petits fruits sucrés. Peut être cultivée en pot à l'intérieur.",
    image: "https://images.unsplash.com/photo-1518977956122-7dc1ec4e8cb2?w=300",
    category: "légume",
    difficulty: "moyen",
    sunlight: "forte",
    growthRate: "rapide",
    tags: ["légume", "fruit", "comestible", "tomate"],
    careInstructions: {
      watering: {
        frequency: "daily",
        amount: "moderate"
      },
      temperature: {
        min: 18,
        max: 30,
        optimal: 24
      },
      humidity: {
        min: 50,
        max: 70,
        optimal: 60
      }
    },
    isPublic: true
  },
  {
    name: "Lavande",
    species: "Lavandula angustifolia",
    description: "Plante aromatique aux fleurs violettes parfumées. Réputée pour ses propriétés relaxantes.",
    image: "https://images.unsplash.com/photo-1611909023032-2d67a49974eb?w=300",
    category: "fleur",
    difficulty: "moyen",
    sunlight: "forte",
    growthRate: "moyenne",
    tags: ["fleur", "aromatique", "relaxant", "parfumé"],
    careInstructions: {
      watering: {
        frequency: "weekly",
        amount: "minimal"
      },
      temperature: {
        min: 15,
        max: 25,
        optimal: 20
      },
      humidity: {
        min: 30,
        max: 50,
        optimal: 40
      }
    },
    isPublic: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/seed_hetic');
    console.log('✅ Connexion à MongoDB réussie');
    const existingCount = await PlantCatalog.countDocuments();
    console.log(`📊 Nombre de plantes existantes dans le catalogue: ${existingCount}`);

    if (existingCount >= 5) {
      console.log('💡 Le catalogue contient déjà suffisamment de plantes. Arrêt du peuplement.');
      process.exit(0);
    }

    console.log('🌱 Ajout des plantes d\'exemple...');
    
    for (const plantData of samplePlants) {
      const existing = await PlantCatalog.findOne({ 
        $or: [
          { name: plantData.name },
          { species: plantData.species }
        ]
      });

      if (!existing) {
        const plant = new PlantCatalog(plantData);
        await plant.save();
        console.log(`   ✅ Ajouté: ${plantData.name} (${plantData.species})`);
      } else {
        console.log(`   ⏭️  Existe déjà: ${plantData.name}`);
      }
    }

    console.log('\n🎉 Peuplement terminé avec succès !');

    const finalCount = await PlantCatalog.countDocuments();
    console.log(`📊 Total de plantes dans le catalogue: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
}
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, samplePlants };
