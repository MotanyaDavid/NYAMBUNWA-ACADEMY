// ============================================
// NYAMBUNWA ACADEMY
// Central Data Configuration File
// ============================================

const schoolData = {
  // --- SCHOOL IDENTITY ---
  name: "Nyambunwa Academy",
  shortName: "Nyambunwa",
  motto: "Excel for Scholarship",
  tagline: "Nurturing Excellence, Building Character, Shaping Future Leaders",
  shortDescription:
    "Nyambunwa Academy is a private day and boarding school offering the Competency-Based Curriculum (CBC) from Kindergarten through Grade 9. We provide a holistic education that develops academically excellent, morally grounded, and socially responsible learners in a safe, nurturing environment.",
  foundingYear: "[UPDATE LATER]",
  schoolType: "Private Day and Boarding School",
  affiliation: "Kenya Private Schools Association (KPSA)",

  // --- CURRICULUM ---
  curriculum: "Competency-Based Curriculum (CBC)",
  examinationBodies: ["Kenya National Examinations Council (KNEC)"],

  // --- LOCATION ---
  mainCampus: {
    name: "Main Campus",
    address: "Asumbi Road, Suneka",
    city: "Kisii",
    county: "Kisii County",
    country: "Kenya",
    postalAddress: "P.O. Box 742 - 40200, Suneka",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.757226587167!2d34.766667!3d-0.683333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwNDEnMDAuMCJTIDM0wrA0NicwMC4wIkU!5e0!3m2!1sen!2ske!4v1620000000000",
  },

  additionalCampuses: [],

  // --- CONTACT INFORMATION ---
  phone: {
    main: "0757862075",
    admissions: "0757862075",
    displayFormat: "0757 862 075",
  },
  email: {
    general: "nyambunwaacademy@gmail.com",
    admissions: "nyambunwaacademy@gmail.com",
    careers: "nyambunwaacademy@gmail.com",
    principal: "nyambunwaacademy@gmail.com",
  },
  workingHours: {
    weekdays: "Monday - Friday: 8:00 - 17:00",
    saturday: "Saturday: 8:00 - 13:00",
    sunday: "Sunday: Closed",
    shortDisplay: "Mon-Fri: 8:00 - 17:00 | Sat: 8:00 - 13:00 | Sun: Closed",
  },
  whatsappNumber: "0757862075",

  // --- SOCIAL MEDIA ---
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
  },

  // --- PROGRAMS ---
  programs: [
    {
      name: "Kindergarten",
      grades: "PP1 - PP2",
      ageRange: "4 - 6 years",
      description:
        "Our Kindergarten program provides a warm, stimulating environment where young learners develop foundational skills through play-based and activity-centered learning, following the CBC framework.",
      image: "assets/images/programs/kindergarten.jpg",
    },
    {
      name: "Lower Primary",
      grades: "Grade 1 - 3",
      ageRange: "6 - 9 years",
      description:
        "The Lower Primary curriculum builds strong literacy, numeracy, and critical thinking skills while nurturing curiosity and a love for learning in every child.",
      image: "assets/images/programs/primary.jpg",
    },
    {
      name: "Upper Primary",
      grades: "Grade 4 - 6",
      ageRange: "9 - 12 years",
      description:
        "Our Upper Primary program deepens academic foundations and introduces learners to more complex concepts, preparing them for the transition to Junior Secondary.",
      image: "assets/images/programs/junior-secondary.jpg",
    },
    {
      name: "Junior Secondary",
      grades: "Grade 7 - 9",
      ageRange: "12 - 15 years",
      description:
        "The Junior Secondary program offers a broad curriculum that helps students discover their strengths and interests while building skills for senior school and beyond.",
      image: "assets/images/programs/senior-secondary.jpg",
    },
  ],

  // --- WHY CHOOSE NYAMBUNWA ---
  features: [
    {
      icon: "fa-solid fa-book",
      title: "CBC Curriculum Excellence",
      description:
        "We deliver the Competency-Based Curriculum with fidelity, ensuring every learner develops the knowledge, skills, and attitudes needed for success in the 21st century.",
    },
    {
      icon: "fa-solid fa-graduation-cap",
      title: "Academic Excellence",
      description:
        "Our dedicated teachers and rigorous curriculum consistently produce outstanding results, building strong foundations for future academic achievement.",
    },
    {
      icon: "fa-solid fa-shield-heart",
      title: "Safe & Nurturing Environment",
      description:
        "We provide a secure, supportive campus where every child feels valued, respected, and empowered to explore their full potential.",
    },
    {
      icon: "fa-solid fa-person-chalkboard",
      title: "Qualified & Passionate Staff",
      description:
        "Our teachers are highly trained, TSC-registered professionals committed to ongoing development and genuinely care about each student's success.",
    },
    {
      icon: "fa-solid fa-house",
      title: "Day & Boarding Options",
      description:
        "We offer both day and boarding facilities, giving families the flexibility to choose what works best for their child's needs and circumstances.",
    },
    {
      icon: "fa-solid fa-people-group",
      title: "Strong Community Partnership",
      description:
        "We believe education is a partnership between school, parents, and community. We foster open communication and active parental involvement.",
    },
  ],

  // --- SCHOOL STATISTICS ---
  stats: {
    yearsOfExcellence: "[UPDATE LATER]",
    totalStudents: "[UPDATE LATER]",
    teachingStaff: "[UPDATE LATER]",
    nonTeachingStaff: "[UPDATE LATER]",
    studentTeacherRatio: "[UPDATE LATER]",
    averageClassSize: "[UPDATE LATER]",
    passRate: "[UPDATE LATER]",
    clubsAndSocieties: "[UPDATE LATER]",
    sportsDisciplines: "[UPDATE LATER]",
  },

  // --- LEADERSHIP TEAM ---
  leadership: [
    {
      name: "[UPDATE LATER - Principal Name]",
      title: "School Director & Principal",
      bio: "[UPDATE LATER - Principal bio]",
      image: "assets/images/staff/principal.jpg",
      quote: "[UPDATE LATER - Principal quote]",
    },
  ],

  // --- TESTIMONIALS ---
  testimonials: [
    {
      quote: "[UPDATE LATER - Parent testimonial]",
      parentName: "[UPDATE LATER]",
      childInfo: "[UPDATE LATER]",
      image: "assets/images/testimonials/parent-1.jpg",
    },
  ],

  // --- LATEST NEWS ---
  latestNews: [
    {
      date: "2025-09-15",
      title: "Nyambunwa Academy Students Excel in National Examinations",
      excerpt:
        "Our Grade 9 students achieved outstanding results in the recent national assessments, with over 90% meeting or exceeding grade-level expectations.",
      fullBody:
        "<p>Nyambunwa Academy is proud to announce the exceptional performance of our Grade 9 students in the recent Competency-Based Curriculum assessments. With over 90% of students meeting or exceeding grade-level expectations, this marks our best performance to date.</p><p>The school's commitment to the CBC framework, combined with dedicated teachers and supportive parents, has created an environment where learners thrive. Our students demonstrated strong competencies across all learning areas, particularly in Mathematics, Sciences, and Languages.</p><p>'These results reflect the hard work of our students, the dedication of our teaching staff, and the unwavering support of our parents,' said the school administration. 'At Nyambunwa Academy, we believe every child can excel for scholarship, and these results prove it.'</p><p>Special recognition goes to the top performers who will be honored at the upcoming Prize Giving Day ceremony. The school continues to strive for excellence as we prepare our learners for the transition to Senior Secondary.</p>",
      image: "assets/images/news/kcse-results-2025.jpg",
      category: "Academics",
    },
  ],

  // --- UPCOMING EVENTS ---
  upcomingEvents: [
    {
      date: "[UPDATE LATER - YYYY-MM-DD]",
      title: "[UPDATE LATER - Event title]",
      description: "[UPDATE LATER - Event description]",
      time: "[UPDATE LATER]",
      location: "[UPDATE LATER]",
    },
  ],

  // --- CORE VALUES ---
  coreValues: [
    {
      name: "Excellence",
      description:
        "We pursue the highest standards in academics, character, and service, striving to excel in everything we do.",
    },
    {
      name: "Integrity",
      description:
        "We uphold honesty, transparency, and strong moral principles as the foundation of our community.",
    },
    {
      name: "Discipline",
      description:
        "We cultivate self-discipline and responsibility, essential qualities for lifelong success.",
    },
    {
      name: "Respect",
      description:
        "We treat everyone with dignity, valuing diversity and fostering a culture of mutual respect.",
    },
    {
      name: "Service",
      description:
        "We instill a sense of responsibility to serve our community and make a positive impact in the world.",
    },
  ],

  // --- SCHOOL HISTORY MILESTONES ---
  milestones: [
    {
      year: "[UPDATE LATER]",
      event:
        "Nyambunwa Academy founded with a vision to provide quality education to the Suneka community.",
    },
  ],

  // --- FAQ ---
  faqs: [
    {
      question: "What curriculum does Nyambunwa Academy follow?",
      answer:
        "We follow the Competency-Based Curriculum (CBC) as mandated by the Kenya Institute of Curriculum Development (KICD). Our program covers Kindergarten (PP1-PP2), Lower Primary (Grade 1-3), Upper Primary (Grade 4-6), and Junior Secondary (Grade 7-9).",
    },
    {
      question: "Do you offer boarding facilities?",
      answer:
        "Yes, Nyambunwa Academy is both a day and boarding school. Our boarding facilities provide a safe, comfortable, and well-supervised environment where students can focus on their studies and personal development.",
    },
    {
      question: "Where is Nyambunwa Academy located?",
      answer:
        "We are located on Asumbi Road in Suneka, Kisii County. Our postal address is P.O. Box 742 - 40200, Suneka.",
    },
    {
      question: "How can I contact the school?",
      answer:
        "You can reach us by phone at 0757 862 075, by email at nyambunwaacademy@gmail.com, or visit our campus on Asumbi Road, Suneka. Our working hours are Monday to Friday 8:00 AM - 5:00 PM and Saturday 8:00 AM - 1:00 PM.",
    },
    {
      question: "What is the admissions process?",
      answer:
        "The process begins with submitting an inquiry form on our website. This is followed by a school tour, an entrance assessment for your child, a brief family interview, and finally an offer of admission if successful.",
    },
    {
      question: "How do I apply for admission?",
      answer:
        "Visit our Admissions page, fill out the inquiry form, and our admissions team will guide you through the entire process. You can also call 0757 862 075 or visit our campus directly.",
    },
  ],

  // --- DOWNLOADS ---
  downloads: {
    admissions: [
      {
        name: "Application for Admission Form",
        file: "assets/downloads/admission-form.pdf",
      },
      {
        name: "Fee Structure 2026",
        file: "assets/downloads/fee-structure-2026.pdf",
      },
      {
        name: "Admission Checklist",
        file: "assets/downloads/admission-checklist.pdf",
      },
    ],
    academic: [
      {
        name: "Term Dates Calendar",
        file: "assets/downloads/term-dates-2026.pdf",
      },
      {
        name: "Approved Book List",
        file: "assets/downloads/booklist-2026.pdf",
      },
    ],
    policies: [
      {
        name: "Child Protection & Safeguarding Policy",
        file: "assets/downloads/child-protection-policy.pdf",
      },
    ],
    newsletters: [],
  },

  // --- CURRENT JOB VACANCIES ---
  vacancies: [],

  // --- REASONS TO WORK HERE ---
  workReasons: [
    {
      icon: "fa-solid fa-hand-holding-heart",
      title: "Supportive Community",
      description:
        "Join a warm, collaborative team where your contributions are valued and your professional growth is actively supported.",
    },
    {
      icon: "fa-solid fa-seedling",
      title: "Professional Growth",
      description:
        "We invest in our staff through regular training, workshops, and opportunities for career advancement.",
    },
    {
      icon: "fa-solid fa-money-bill-wave",
      title: "Competitive Package",
      description:
        "We offer a competitive salary and benefits package commensurate with qualifications and experience.",
    },
    {
      icon: "fa-solid fa-scale-balanced",
      title: "Work-Life Balance",
      description:
        "We respect your time and wellbeing with reasonable workloads and a supportive management team.",
    },
  ],

  // --- SCHOOL PORTALS ---
  portals: [
    {
      name: "Student Portal",
      icon: "fa-solid fa-user-graduate",
      description:
        "Access your timetable, assignments, grades, and learning resources.",
      url: "[UPDATE LATER]",
      buttonText: "Student Login",
    },
    {
      name: "Parent Portal",
      icon: "fa-solid fa-people-roof",
      description:
        "Track your child's academic progress, fee balance, and attendance.",
      url: "[UPDATE LATER]",
      buttonText: "Parent Login",
    },
    {
      name: "Staff Portal",
      icon: "fa-solid fa-chalkboard-user",
      description:
        "Access internal resources, submit reports, and manage student records.",
      url: "[UPDATE LATER]",
      buttonText: "Staff Login",
    },
  ],

  // --- ACCREDITATIONS ---
  accreditations: [
    {
      name: "Ministry of Education, Kenya",
      image: "assets/images/accreditations/moe.png",
    },
    {
      name: "Kenya Private Schools Association",
      image: "assets/images/accreditations/kpsa.png",
    },
    {
      name: "TSC Registered Institution",
      image: "assets/images/accreditations/tsc.png",
    },
  ],
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = schoolData;
}
