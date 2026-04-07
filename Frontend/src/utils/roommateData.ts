// Shared roommate profiles data
export interface RoommateProfile {
  id: string
  name: string
  age: number
  gender: string
  occupation: string
  budget: string
  location: string
  moveInDate: string
  bio: string
  tags: string[]
  verified: boolean
  image: string
  preferences?: {
    cleanliness: string
    smoking: string
    drinking: string
    guests: string
    pets: string
    food: string
  }
  socials?: {
    instagram?: string
    linkedin?: string
  }
}

export const allRoommates: RoommateProfile[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    age: 24,
    gender: 'Male',
    occupation: 'Software Developer',
    budget: 'NPR 10,000 - 15,000',
    location: 'Koteshwor, Kathmandu',
    moveInDate: 'Immediate',
    bio: "Hi! I'm a software developer working for a tech company in Thamel. I'm clean, organized, and respect privacy. I usually work from home 2 days a week. I enjoy hiking on weekends and cooking dinner sometimes. Looking for a friendly roommate to share a flat with.",
    tags: ['Early Riser', 'Non-Smoker', 'Vegetarian'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Very Clean',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Occasional',
      pets: 'No pets',
      food: 'Vegetarian',
    },
    socials: {
      instagram: 'aarav_s',
      linkedin: 'aarav-sharma',
    },
  },
  {
    id: '2',
    name: 'Priya Adhikari',
    age: 22,
    gender: 'Female',
    occupation: 'Student',
    budget: 'NPR 8,000 - 12,000',
    location: 'Baneshwor, Kathmandu',
    moveInDate: 'Next Month',
    bio: 'Masters student at TU. Looking for a female roommate. I study a lot so I prefer a quiet environment. Love reading and occasional movie nights.',
    tags: ['Student', 'Quiet', 'No Pets'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Clean',
      smoking: 'Non-smoker',
      drinking: 'Rarely',
      guests: 'Rarely',
      pets: 'No pets',
      food: 'Vegetarian',
    },
  },
  {
    id: '3',
    name: 'Suman Gurung',
    age: 28,
    gender: 'Male',
    occupation: 'Chef',
    budget: 'NPR 15,000 - 20,000',
    location: 'Pokhara Lakeside',
    moveInDate: 'In 2 weeks',
    bio: 'Working at a hotel in Lakeside. I love cooking and often make extra food for roommates! Night owl due to work schedule.',
    tags: ['Foodie', 'Night Owl', 'Social'],
    verified: false,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Generally tidy',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Often',
      pets: 'Open to pets',
      food: 'Non-vegetarian',
    },
  },
  {
    id: '4',
    name: 'Rina Tamang',
    age: 25,
    gender: 'Female',
    occupation: 'Nurse',
    budget: 'NPR 12,000 - 18,000',
    location: 'Lalitpur',
    moveInDate: 'Immediate',
    bio: 'Working shifts at Patan Hospital. Need a place that is quiet during the day. Pet friendly and love animals!',
    tags: ['Clean', 'Shift Worker', 'Pet Friendly'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Very Clean',
      smoking: 'Non-smoker',
      drinking: 'Rarely',
      guests: 'Occasional',
      pets: 'Love pets',
      food: 'Non-vegetarian',
    },
  },
  {
    id: '5',
    name: 'Bibek Thapa',
    age: 26,
    gender: 'Male',
    occupation: 'Graphic Designer',
    budget: 'NPR 10,000 - 14,000',
    location: 'Bhaktapur',
    moveInDate: 'Flexible',
    bio: 'Creative person, love music and art. Looking for chill roommates who like to hang out. Work from home most days.',
    tags: ['Artist', 'Music Lover', 'Chill'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Generally tidy',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Often',
      pets: 'Open to pets',
      food: 'Non-vegetarian',
    },
  },
  {
    id: '6',
    name: 'Sarah Shrestha',
    age: 23,
    gender: 'Female',
    occupation: 'Marketing Intern',
    budget: 'NPR 9,000 - 13,000',
    location: 'Thamel',
    moveInDate: 'Next Month',
    bio: 'New in the city. Looking for a friendly place. I love exploring cafes and hiking on weekends.',
    tags: ['Social', 'Hiker', 'Coffee Lover'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Clean',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Often',
      pets: 'Open to pets',
      food: 'Non-vegetarian',
    },
  },
  {
    id: '7',
    name: 'Kiran KC',
    age: 27,
    gender: 'Male',
    occupation: 'Banker',
    budget: 'NPR 18,000',
    location: 'Lazimpat',
    moveInDate: 'Immediate',
    bio: 'Professional banker looking for a clean and quiet place. I work long hours and value a peaceful home environment.',
    tags: ['Professional', 'Quiet', 'Clean'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Very Clean',
      smoking: 'Non-smoker',
      drinking: 'Rarely',
      guests: 'Rarely',
      pets: 'No pets',
      food: 'Non-vegetarian',
    },
  },
  {
    id: '8',
    name: 'Anjali Lama',
    age: 24,
    gender: 'Female',
    occupation: 'Teacher',
    budget: 'NPR 11,000',
    location: 'Kalanki',
    moveInDate: 'Next Week',
    bio: 'School teacher. Early riser. Looking for female roommates only. Love yoga and meditation.',
    tags: ['Teacher', 'Early Riser', 'Female Only'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Very Clean',
      smoking: 'Non-smoker',
      drinking: 'Never',
      guests: 'Rarely',
      pets: 'No pets',
      food: 'Vegetarian',
    },
  },
  {
    id: '9',
    name: 'Rohit Gupta',
    age: 29,
    gender: 'Male',
    occupation: 'Entrepreneur',
    budget: 'NPR 25,000',
    location: 'Jhamsikhel',
    moveInDate: 'Flexible',
    bio: 'Running my own startup. Need a premium place with good internet. Work from home and often have late night calls.',
    tags: ['Entrepreneur', 'Tech', 'Premium'],
    verified: true,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop',
    preferences: {
      cleanliness: 'Clean',
      smoking: 'Non-smoker',
      drinking: 'Socially',
      guests: 'Occasional',
      pets: 'No pets',
      food: 'Non-vegetarian',
    },
  },
]

export function getRoommateById(id: string): RoommateProfile | undefined {
  return allRoommates.find((r) => r.id === id)
}
