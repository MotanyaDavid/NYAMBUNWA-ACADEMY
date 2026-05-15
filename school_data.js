// ============================================
// Nyambunwa Academy website
// Central Data Configuration File
// ============================================
// HOW TO USE:
// Edit the values below to match your school.
// Every page on the website reads from this file.
// Update once, and the entire site reflects changes.
// ============================================

const schoolData = {
  // --- SCHOOL IDENTITY ---
  name: "Nyambunwa Academy",
  shortName: "Nyambunwa",
  motto: "Excellence for Scholarship",
  tagline: "Shaping Tomorrow's Leaders",
  shortDescription: "Nyambunwa Academy is committed to providing quality education that fosters intellectual growth, moral development, and social responsibility.",
  foundingYear: 2005,
  schoolType: "Private Co-educational Day and Boarding School",
  affiliation: "Kenya Private Schools Association (KPSA)",

  // --- LOCATION & MULTIPLE CAMPUSES ---
  mainCampus: {
    name: "Schools",
    address: "Suneka-Asumbi Rd",
    city: "Kisii",
    county: "Kisii County",
    country: "Kenya",
    postalAddress: "P.O. Box 742 - 40200 Kisii",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7572265https://maps.app.goo.gl/YAvMUockAMn2aggX687167!2d36.81432931475406!3d-1.3196118990399248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d2c6f2c6b3%3A0x1c6e6c0e3c1c5e1!2sLangata%20Road!5e0!3m2!1sen!2ske!4v1620000000000"
  },

  // additionalCampuses: [
  //   {
  //     name: "Kindergarten Annex",
  //     address: "Mbagathi Way, Karen",
  //     city: "Nairobi",
  //     phone: "+254 711 222 333",
  //     mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.700000000000!2d36.700000000000!3d-1.350000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMjEnMDAuMCJTIDM2wrA0MicwMC4wIkU!5e0!3m2!1sen!2ske!4v1620000000000"
  //   }
  // ],

  // --- CONTACT INFORMATION ---
  phone: {
    main: "+254 757 862 075",
    admissions: "+254 757 862 075",
    displayFormat: "+254 757 862 075"
  },
  email: {
    general: "nyambunwaacademy@gmail.com",
    admissions: "nyambunwaacademy@gmail.com",
    careers: "nyambunwaacademy@gmail.com",
    principal: "nyambunwaacademy@gmail.com"
  },
  workingHours: {
    weekdays: "Monday - Friday: 08:00 - 17:00",
    saturday: "Saturday: 08:00 - 13:00 (Open for inquiries and tours by appointment)",
    sunday: "Sunday: Closed",
    shortDisplay: "Mon-Fri: 08:00 - 17:00 | Sat: 08:00 - 13:00 | Sun: Closed"
  },
  whatsappNumber: "254757862075",

  // --- SOCIAL MEDIA ---
//   socialMedia: {
//     facebook: "https://facebook.com/sunshineschools",
//     twitter: "https://twitter.com/sunshineschools",
//     instagram: "https://instagram.com/sunshineschools",
//     youtube: "https://youtube.com/@sunshineschools",
//     linkedin: "https://linkedin.com/company/sunshineschools"
//   },

  // --- ACADEMIC STRUCTURE ---
  curriculum: "8-4-4 and CBC (Competency-Based Curriculum)",
  examinationBodies: ["KNEC (Kenya National Examinations Council)"],

  programs: [
    {
      name: "Pre School",
      grades: "Playgroup - PP2",
      ageRange: "3 - 6 years",
      description: "Our Kindergarten program provides a warm, stimulating environment where young learners develop foundational skills through play-based and activity-centered learning.",
      image: "assets/images/programs/kindergarten.jpg"
    },
    {
      name: "Lower Primary",
      grades: "Grade 1 - 3",
      ageRange: "6 - 11 years",
      description: "The Primary School curriculum builds strong literacy, numeracy, and critical thinking skills while nurturing curiosity and a love for learning.",
      image: "assets/images/programs/primary.jpg"
    },
    {
      name: "Upper Primary",
      grades: "Grade 4 - 6",
      ageRange: "12 - 14 years",
      description: "Our Junior Secondary program bridges the transition to advanced studies, offering a broad curriculum that helps students discover their strengths and interests.",
      image: "assets/images/programs/junior-secondary.jpg"
    },
  ],

  // --- WHY CHOOSE US ---
  features: [
    {
      icon: "fa-solid fa-book-bible",
      title: "Faith-Based Education",
      description: "We ground our students in strong Christian values, nurturing integrity, compassion, and a sense of purpose that guides them throughout their lives."
    },
    {
      icon: "fa-solid fa-graduation-cap",
      title: "Academic Excellence",
      description: "Our rigorous curriculum and dedicated teachers consistently produce outstanding examination results, opening doors to top secondary schools and universities."
    },
    {
      icon: "fa-solid fa-shield-heart",
      title: "Safe & Nurturing Environment",
      description: "We provide a secure, supportive campus where every child feels valued, respected, and empowered to explore their full potential without fear."
    },
    {
      icon: "fa-solid fa-person-chalkboard",
      title: "Qualified & Passionate Staff",
      description: "Our teachers are highly trained, TSC-registered professionals who are committed to ongoing development and genuinely care about each student's success."
    },
    {
      icon: "fa-solid fa-computer",
      title: "Modern Learning Facilities",
      description: "From well-equipped science labs to a fully stocked library and ICT center, we provide the resources students need to thrive in the 21st century."
    },
    {
      icon: "fa-solid fa-people-group",
      title: "Strong Community Partnership",
      description: "We believe education is a partnership between school, parents, and community. We foster open communication and active parental involvement."
    }
  ],

  // --- SCHOOL STATISTICS ---
  stats: {
    yearsOfExcellence: 30,
    totalStudents: 300,
    teachingStaff: 15,
    nonTeachingStaff: 30,
    studentTeacherRatio: "15:1",
    averageClassSize: 30,
    kcsePassRate: 98,
    universityTransitionRate: 92,
    alumniCount: 5000,
    clubsAndSocieties: 25,
    sportsDisciplines: 12,
    acresOfCampus: 15
  },

  // --- LEADERSHIP TEAM ---
  leadership: [
    {
      name: "Dr. Jane Muthoni",
      title: "School Director & Principal",
      bio: "Dr. Muthoni has over 25 years of experience in education leadership. She holds a PhD in Educational Management from the University of Nairobi and is passionate about holistic child development.",
      image: "assets/images/staff/principal.jpg",
      quote: "At Nyambunwa Academy, we don't just teach subjects; we shape character, ignite curiosity, and prepare leaders who will transform their communities."
    },
    {
      name: "Mr. Peter Waweru",
      title: "Deputy Principal - Academics",
      bio: "Mr. Waweru oversees curriculum implementation and academic standards. He is a published author and KNEC examiner with a Master's degree in Curriculum Studies.",
      image: "assets/images/staff/deputy-academics.jpg"
    },
    {
      name: "Mrs. Susan Akinyi",
      title: "Deputy Principal - Administration",
      bio: "Mrs. Akinyi manages school operations, student welfare, and discipline. She holds an MBA in Strategic Management and brings 15 years of administrative experience.",
      image: "assets/images/staff/deputy-admin.jpg"
    },
    {
      name: "Mr. David Kiprono",
      title: "Head of Senior Secondary",
      bio: "Mr. Kiprono leads the senior school team with a focus on academic mentorship and career guidance. He is a specialist in Mathematics and Physics.",
      image: "assets/images/staff/hod-senior.jpg"
    },
    {
      name: "Mrs. Grace Njeri",
      title: "Head of Primary Section",
      bio: "Mrs. Njeri is a specialist in early childhood and primary education with a warm, student-centered approach that makes learning joyful and effective.",
      image: "assets/images/staff/hod-primary.jpg"
    },
    {
      name: "Madam Fatima Hassan",
      title: "Head of Kindergarten",
      bio: "Madam Fatima creates a magical learning environment for our youngest students, with expertise in play-based learning and early literacy development.",
      image: "assets/images/staff/hod-kindergarten.jpg"
    }
  ],

  // --- TESTIMONIALS ---
  testimonials: [
    {
      quote: "Nyambunwa Academy transformed our son. He was shy and struggling academically. Within two years, his confidence soared, and he emerged as a top performer. The teachers here genuinely care.",
      parentName: "Mrs. Wanjiku Kamau",
      childInfo: "Parent of Kevin, Grade 6",
      image: "assets/images/testimonials/parent-1.jpg"
    },
    {
      quote: "We moved our three children to Nyambunwa Academy from another school, and it was the best decision we ever made. The discipline, the values, and the academic rigor are simply unmatched.",
      parentName: "Mr. & Mrs. Ochieng",
      childInfo: "Parents of Amani, Baraka & Chiku",
      image: "assets/images/testimonials/parent-2.jpg"
    },
    {
      quote: "As an alumnus, I can confidently say Nyambunwa Academy laid the foundation for everything I've achieved. The leadership skills and strong moral compass I developed here still guide me today.",
      parentName: "Eng. James Mwangi",
      childInfo: "Alumnus, Class of 2008, now an Alumni Parent",
      image: "assets/images/testimonials/parent-3.jpg"
    },
    {
      quote: "What sets Nyambunwa apart is the partnership with parents. The school communicates regularly and genuinely involves us in our child's journey. It feels like family.",
      parentName: "Mrs. Aisha Bello",
      childInfo: "Parent of Zara, Grade 3",
      image: "assets/images/testimonials/parent-4.jpg"
    }
  ],

  // --- LATEST NEWS ---
  latestNews: [
    {
      date: "2025-09-15",
      title: "Nyambunwa Academy Tops National Science Fair for Third Consecutive Year",
      excerpt: "Our students showcased groundbreaking projects in renewable energy and sustainable agriculture, earning top honors at the National Science and Engineering Fair held at KICC.",
      image: "assets/images/news/science-fair-2025.jpg",
      category: "Achievements"
    },
    {
      date: "2025-08-28",
      title: "2025 KCSE Results: Nyambunwa Maintains 98% University Transition Rate",
      excerpt: "We celebrate our Form Four graduates who have made us proud with exceptional performance in the 2025 KCSE examinations, with 45 students scoring A- and above.",
      image: "assets/images/news/kcse-results-2025.jpg",
      category: "Academics"
    },
    {
      date: "2025-08-10",
      title: "New State-of-the-Art ICT Center Commissioned",
      excerpt: "Nyambunwa Academy has unveiled a modern ICT center equipped with 60 workstations, high-speed internet, and interactive smart boards to enhance digital literacy across all grade levels.",
      image: "assets/images/news/ict-center-2025.jpg",
      category: "Facilities"
    }
  ],

  // --- UPCOMING EVENTS ---
  upcomingEvents: [
    {
      date: "2025-10-05",
      title: "Open Day & School Tour",
      description: "Prospective parents and students are invited to tour our campus, meet teachers, and experience life at Nyambunwa Academy firsthand.",
      time: "9:00 AM - 3:00 PM",
      location: "Main Campus Hall"
    },
    {
      date: "2025-10-20",
      title: "Annual Sports Day",
      description: "Join us for a day of athletic excellence, teamwork, and family fun as our four houses compete for the coveted Sports Day trophy.",
      time: "8:00 AM - 4:00 PM",
      location: "School Sports Ground"
    },
    {
      date: "2025-11-15",
      title: "End of Term One Closing Ceremony & Prize Giving",
      description: "We celebrate our students' achievements across academics, sports, arts, and character development.",
      time: "10:00 AM - 1:00 PM",
      location: "School Auditorium"
    }
  ],

  // --- DOWNLOADS ---
  downloads: {
    admissions: [
      { name: "Application for Admission Form", file: "assets/downloads/admission-form.pdf" },
      { name: "Fee Structure 2026", file: "assets/downloads/fee-structure-2026.pdf" },
      { name: "Admission Checklist", file: "assets/downloads/admission-checklist.pdf" },
      { name: "School Uniform Requirements", file: "assets/downloads/uniform-requirements.pdf" }
    ],
    academic: [
      { name: "2026 Term Dates Calendar", file: "assets/downloads/term-dates-2026.pdf" },
      { name: "KCSE Examination Timetable", file: "assets/downloads/kcse-timetable.pdf" },
      { name: "Approved Book List 2026", file: "assets/downloads/booklist-2026.pdf" },
      { name: "Co-Curricular Activity Schedule", file: "assets/downloads/clubs-schedule.pdf" }
    ],
    policies: [
      { name: "Child Protection & Safeguarding Policy", file: "assets/downloads/child-protection-policy.pdf" },
      { name: "ICT Acceptable Use Policy", file: "assets/downloads/ict-policy.pdf" },
      { name: "School Uniform & Grooming Policy", file: "assets/downloads/uniform-policy.pdf" },
      { name: "Anti-Bullying Policy", file: "assets/downloads/anti-bullying-policy.pdf" },
      { name: "Parent-School Partnership Guidelines", file: "assets/downloads/parent-partnership.pdf" }
    ],
    newsletters: [
      { name: "The Nyambunwa Times - September 2025", file: "assets/downloads/newsletter-sept-2025.pdf" },
      { name: "The Nyambunwa Times - July 2025", file: "assets/downloads/newsletter-july-2025.pdf" },
      { name: "The Nyambunwa Times - May 2025", file: "assets/downloads/newsletter-may-2025.pdf" }
    ]
  },

  // --- FAQ ---
  faqs: [
    {
      question: "What curriculum does Sunshine Schools follow?",
      answer: "We follow both the 8-4-4 system and the Competency-Based Curriculum (CBC) as mandated by the Kenya Institute of Curriculum Development (KICD). Our students sit for the Kenya Certificate of Primary Education (KCPE)."
    },
    {
      question: "What is the student-to-teacher ratio?",
      answer: "Our average student-to-teacher ratio is 15:1, with a maximum class size of 30 students. This ensures every child receives individual attention and support."
    },
    {
      question: "Do you offer school transport?",
      answer: "Yes, we operate a fleet of modern, GPS-tracked school buses serving major routes across Nairobi. Transport fees vary by route. Please contact our admissions office for specific route information."
    },
    {
      question: "What co-curricular activities are available?",
      answer: "We offer over 25 clubs and societies including Drama, Music, Debate, Scouts, Chess, Coding & Robotics, Environmental Club, Journalism, and Young Farmers. We also field competitive teams in 12 sports including Football, Basketball, Swimming, Athletics, Rugby, Hockey, and Tennis."
    },
    {
      question: "What is the admissions process?",
      answer: "The process begins with submitting an inquiry form. This is followed by a school tour, an entrance assessment for your child, a brief family interview, and finally an offer of admission if successful. The full step-by-step process is detailed on our Admissions page."
    },
    {
      question: "Do you offer boarding facilities?",
      answer: "Currently, Sunshine Schools is a day school only. However, we offer extended day programs and supervised homework sessions until 6:00 PM for working parents."
    },
    {
      question: "How do you support students with different learning needs?",
      answer: "We have a dedicated Learning Support Department that works with students who need extra help or enrichment. Our teachers differentiate instruction to accommodate diverse learning styles, and we maintain close communication with parents about their child's progress."
    },
    {
      question: "What are your school fees?",
      answer: "Fees vary by grade level. Our comprehensive fee structure document is available for download on the Admissions page. We offer flexible payment plans and a sibling discount. Please contact our accounts office for detailed information."
    }
  ],

  // --- CURRENT JOB VACANCIES ---
  vacancies: [
    {
      title: "Mathematics & Physics Teacher (Senior Secondary)",
      department: "Academics - Sciences",
      location: "Main Campus",
      type: "Full-time",
      closingDate: "2025-11-15",
      description: "We seek an experienced Mathematics and Physics teacher to join our Senior Secondary team. The ideal candidate holds a Bachelor of Education (Science) degree, is TSC-registered, and has at least 5 years of KCSE teaching experience with a proven track record of excellent results."
    },
    {
      title: "Kindergarten Class Teacher",
      department: "Kindergarten Section",
      location: "Kindergarten Annex, Karen",
      type: "Full-time",
      closingDate: "2025-11-10",
      description: "We are looking for a warm, creative, and energetic Kindergarten teacher with training in Early Childhood Development Education (ECDE). Minimum 3 years experience in a reputable Kindergarten. CBC training is required."
    },
    {
      title: "School Nurse",
      department: "Student Welfare",
      location: "Main Campus",
      type: "Full-time",
      closingDate: "2025-10-30",
      description: "A registered nurse (KRN/KRCHN) is needed to manage our school clinic, provide first aid, maintain student health records, and lead health education initiatives. Pediatric nursing experience is an added advantage."
    }
  ],

  // --- REASONS TO WORK HERE ---
  workReasons: [
    {
      icon: "fa-solid fa-hand-holding-heart",
      title: "Supportive Community",
      description: "Join a warm, collaborative team where your contributions are valued and your professional growth is actively supported."
    },
    {
      icon: "fa-solid fa-seedling",
      title: "Professional Growth",
      description: "We invest in our staff through regular training, workshops, and opportunities for career advancement within the school."
    },
    {
      icon: "fa-solid fa-money-bill-wave",
      title: "Competitive Package",
      description: "We offer a competitive salary and benefits package commensurate with qualifications and experience."
    },
    {
      icon: "fa-solid fa-scale-balanced",
      title: "Work-Life Balance",
      description: "We respect your time and wellbeing with reasonable workloads, generous leave policies, and a supportive management team."
    }
  ],

  // --- SCHOOL PORTALS ---
  portals: [
    {
      name: "Student Portal",
      icon: "fa-solid fa-user-graduate",
      description: "Access your timetable, assignments, grades, learning resources, and school announcements.",
      url: "https://student.sunshineschools.sc.ke",
      buttonText: "Student Login"
    },
    {
      name: "Parent Portal",
      icon: "fa-solid fa-people-roof",
      description: "Track your child's academic progress, fee balance, attendance, and communicate directly with teachers.",
      url: "https://parents.sunshineschools.sc.ke",
      buttonText: "Parent Login"
    },
    {
      name: "Staff Portal",
      icon: "fa-solid fa-chalkboard-user",
      description: "Access internal resources, submit reports, manage student records, and collaborate with colleagues.",
      url: "https://staff.sunshineschools.sc.ke",
      buttonText: "Staff Login"
    }
  ],

  // --- SCHOOL HISTORY MILESTONES ---
  milestones: [
    { year: 1995, event: "Nyambunwa Academy founded with 45 students and 6 teachers in a rented facility on Ngong Road." },
    { year: 2000, event: "First KCPE graduating class achieves 100% pass rate. Student population grows to 300." },
    { year: 2005, event: "Moved to current permanent campus on Langata Road. Added science laboratories and library." },
    { year: 2010, event: "Opened Kindergarten Annex in Karen. Introduced ICT as a core subject across all grades." },
    { year: 2015, event: "Celebrated 20th anniversary. Launched scholarship program for deserving students from underprivileged backgrounds." },
    { year: 2020, event: "Successfully transitioned to blended learning during the pandemic with zero learning loss. Upgraded all classrooms with smart boards." },
    { year: 2023, event: "Ranked among top 50 private schools nationally in KCSE. Opened new state-of-the-art sports complex." },
    { year: 2025, event: "Commissioned new ICT center. Student population surpasses 1,200. Launched Junior Secondary in line with CBC." }
  ],

  // --- CORE VALUES ---
  coreValues: [
    { name: "Integrity", description: "We uphold honesty, transparency, and strong moral principles in all that we do." },
    { name: "Excellence", description: "We pursue the highest standards in academics, character, and service." },
    { name: "Compassion", description: "We cultivate empathy, kindness, and a genuine concern for the wellbeing of others." },
    { name: "Resilience", description: "We develop the grit and determination to overcome challenges and grow through adversity." },
    { name: "Service", description: "We instill a sense of responsibility to serve our community and make a positive impact in the world." }
  ],

  // --- ACCOLADES & AFFILIATIONS ---
  accreditations: [
    { name: "Ministry of Education, Kenya", image: "assets/images/accreditations/moe.png" },
    { name: "Kenya Private Schools Association", image: "assets/images/accreditations/kpsa.png" },
    { name: "TSC Registered Institution", image: "assets/images/accreditations/tsc.png" },
    { name: "UNESCO Associated Schools Network", image: "assets/images/accreditations/unesco.png" }
  ]
};

// Make schoolData globally accessible
if (typeof module !== 'undefined' && module.exports) {
  module.exports = schoolData;
}