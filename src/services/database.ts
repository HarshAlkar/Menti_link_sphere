
// Types for our database entities
export interface Message {
  id: string;
  sessionId: string;
  sender: string;
  text: string;
  timestamp: Date;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  messages: Message[];
  title?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'mentor' | 'teacher' | 'admin';
  profilePicture?: string;
  bio?: string;
  expertise?: string[];
  joinDate: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  modules: CourseModule[];
  createdAt: Date;
  updatedAt: Date;
  price?: string;
  category: string;
  duration: string;
  studentsEnrolled: number;
  rating: number;
  reviews: number;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: string;
  duration: string;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt: Date | null;
  progress: number;
  lastAccessedAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  completionDate: Date;
}

// In-memory database (this would be a real database in production)
class InMemoryDatabase {
  private sessions: Session[] = [];
  private messages: Message[] = [];
  private users: User[] = [];
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];
  private certificates: Certificate[] = [];

  constructor() {
    // Initialize with some demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Add a few demo users
    this.users = [
      {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        joinDate: new Date('2023-01-15')
      },
      {
        id: 'user_2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'mentor',
        expertise: ['Web Development', 'React', 'JavaScript'],
        bio: 'Senior Web Developer with 10+ years experience',
        joinDate: new Date('2022-11-05')
      },
      {
        id: 'user_3',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        joinDate: new Date('2022-05-10')
      }
    ];
  }

  // User methods
  createUser(user: Omit<User, 'id'>): User {
    const id = `user_${Date.now()}`;
    const newUser: User = { ...user, id };
    this.users.push(newUser);
    return newUser;
  }

  getUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    
    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }

  // Session methods
  createSession(session: Omit<Session, 'id' | 'messages'>): Session {
    const id = `session_${Date.now()}`;
    const newSession: Session = { 
      ...session, 
      id, 
      messages: []
    };
    this.sessions.push(newSession);
    return newSession;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.find(session => session.id === id);
  }

  updateSession(id: string, updates: Partial<Session>): Session | undefined {
    const sessionIndex = this.sessions.findIndex(session => session.id === id);
    if (sessionIndex === -1) return undefined;
    
    this.sessions[sessionIndex] = { ...this.sessions[sessionIndex], ...updates };
    return this.sessions[sessionIndex];
  }

  listSessionsByMentor(mentorId: string): Session[] {
    return this.sessions.filter(session => session.mentorId === mentorId);
  }

  listSessionsByStudent(studentId: string): Session[] {
    return this.sessions.filter(session => session.studentId === studentId);
  }

  // Message methods
  addMessage(message: Omit<Message, 'id'>): Message {
    const id = `msg_${Date.now()}`;
    const newMessage: Message = { ...message, id };
    this.messages.push(newMessage);
    
    // Add reference to session
    const session = this.getSession(message.sessionId);
    if (session) {
      session.messages.push(newMessage);
    }
    
    return newMessage;
  }

  getSessionMessages(sessionId: string): Message[] {
    return this.messages.filter(message => message.sessionId === sessionId);
  }

  // Course methods
  createCourse(course: Omit<Course, 'id'>): Course {
    const id = `course_${Date.now()}`;
    const newCourse: Course = { ...course, id };
    this.courses.push(newCourse);
    return newCourse;
  }

  getCourse(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return undefined;
    
    this.courses[courseIndex] = { ...this.courses[courseIndex], ...updates };
    return this.courses[courseIndex];
  }

  deleteCourse(id: string): boolean {
    const initialLength = this.courses.length;
    this.courses = this.courses.filter(course => course.id !== id);
    return this.courses.length < initialLength;
  }

  listCourses(filters?: { 
    category?: string, 
    instructorId?: string,
    search?: string
  }): Course[] {
    let result = [...this.courses];
    
    if (filters) {
      if (filters.category) {
        result = result.filter(course => course.category === filters.category);
      }
      
      if (filters.instructorId) {
        result = result.filter(course => course.instructorId === filters.instructorId);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(course => 
          course.title.toLowerCase().includes(searchLower) || 
          course.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    return result;
  }

  // Enrollment methods
  enrollUserInCourse(userId: string, courseId: string): Enrollment {
    const id = `enroll_${Date.now()}`;
    const enrollment: Enrollment = {
      id,
      userId,
      courseId,
      enrolledAt: new Date(),
      completedAt: null,
      progress: 0,
      lastAccessedAt: new Date()
    };
    
    this.enrollments.push(enrollment);
    
    // Update course enrollment count
    const course = this.getCourse(courseId);
    if (course) {
      course.studentsEnrolled++;
    }
    
    return enrollment;
  }

  getUserEnrollments(userId: string): Enrollment[] {
    return this.enrollments.filter(enrollment => enrollment.userId === userId);
  }

  updateEnrollmentProgress(id: string, progress: number): Enrollment | undefined {
    const enrollmentIndex = this.enrollments.findIndex(enrollment => enrollment.id === id);
    if (enrollmentIndex === -1) return undefined;
    
    this.enrollments[enrollmentIndex].progress = progress;
    this.enrollments[enrollmentIndex].lastAccessedAt = new Date();
    
    // If progress is 100%, mark as completed
    if (progress === 100) {
      this.enrollments[enrollmentIndex].completedAt = new Date();
      
      // Generate certificate
      this.generateCertificate(
        this.enrollments[enrollmentIndex].userId,
        this.enrollments[enrollmentIndex].courseId
      );
    }
    
    return this.enrollments[enrollmentIndex];
  }

  // Certificate methods
  generateCertificate(userId: string, courseId: string): Certificate {
    const id = `cert_${Date.now()}`;
    const certificate: Certificate = {
      id,
      userId,
      courseId,
      issuedAt: new Date(),
      completionDate: new Date()
    };
    
    this.certificates.push(certificate);
    return certificate;
  }

  getUserCertificates(userId: string): Certificate[] {
    return this.certificates.filter(cert => cert.userId === userId);
  }

  verifyCertificate(certificateId: string): Certificate | undefined {
    return this.certificates.find(cert => cert.id === certificateId);
  }
}

// Export singleton instance
export const database = new InMemoryDatabase();
