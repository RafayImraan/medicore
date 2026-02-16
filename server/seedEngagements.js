const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FavoriteDoctor = require('./models/FavoriteDoctor');
const ArticleRead = require('./models/ArticleRead');
const WellnessEnrollment = require('./models/WellnessEnrollment');
const ChallengeJoin = require('./models/ChallengeJoin');
const MedicationRefillRequest = require('./models/MedicationRefillRequest');
const MoodLog = require('./models/MoodLog');
const SymptomCheck = require('./models/SymptomCheck');
const ReminderLog = require('./models/ReminderLog');
const InsuranceView = require('./models/InsuranceView');

dotenv.config();

const shouldReset = process.argv.includes('--reset');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    if (shouldReset) {
      await Promise.all([
        FavoriteDoctor.deleteMany({}),
        ArticleRead.deleteMany({}),
        WellnessEnrollment.deleteMany({}),
        ChallengeJoin.deleteMany({}),
        MedicationRefillRequest.deleteMany({}),
        MoodLog.deleteMany({}),
        SymptomCheck.deleteMany({}),
        ReminderLog.deleteMany({}),
        InsuranceView.deleteMany({})
      ]);
      console.log('Engagement collections cleared.');
    }

    await Promise.all([
      FavoriteDoctor.create([
        { doctorId: 'doc-1', doctorName: 'Dr. Amira Khan', specialty: 'Cardiology', source: 'hero' },
        { doctorId: 'doc-2', doctorName: 'Dr. Liam Patel', specialty: 'Neurology', source: 'hero' }
      ]),
      ArticleRead.create([
        { articleId: 'art-1', title: 'Heart Health Essentials', category: 'Cardiology', source: 'hero' },
        { articleId: 'art-2', title: 'Sleep & Recovery', category: 'Wellness', source: 'hero' }
      ]),
      WellnessEnrollment.create([
        { programId: 'wp-1', programName: 'Corporate Wellness Pro', source: 'hero' }
      ]),
      ChallengeJoin.create([
        { challengeId: 'ch-1', challengeName: '10k Steps Daily', source: 'hero' }
      ]),
      MedicationRefillRequest.create([
        { medicationId: 'med-1', medicationName: 'Atorvastatin', dosage: '10mg', form: 'Tablet', source: 'hero' }
      ]),
      MoodLog.create([
        { mood: 'happy', label: 'Happy', source: 'hero' },
        { mood: 'neutral', label: 'Neutral', source: 'hero' }
      ]),
      SymptomCheck.create([
        { symptoms: ['Fever', 'Cough'], result: 'Viral infection', recommendation: 'Rest and hydration', source: 'hero' }
      ]),
      ReminderLog.create([
        { reminderId: 'rem-1', name: 'Metformin', taken: true, source: 'hero' },
        { reminderId: 'rem-2', name: 'Vitamin D', taken: false, source: 'hero' }
      ]),
      InsuranceView.create([
        { insuranceId: 'ins-1', name: 'Aetna Elite', network: 'Premier Network', coverage: 'Platinum', source: 'hero' }
      ])
    ]);

    console.log('Engagement collections seeded.');
  } catch (error) {
    console.error('Engagement seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
