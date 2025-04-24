export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ProjectInfo {
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  components: string[];
  pages: string[];
  services: string[];
}

const projectInfo: ProjectInfo = {
  name: "MentorLink Sphere",
  description: "A comprehensive e-learning platform that connects mentors and students, providing interactive courses, real-time sessions, and learning management features.",
  features: [
    "User Authentication & Role Management",
    "Course Management System",
    "Real-time Video Sessions",
    "Interactive Learning Materials",
    "Quiz & Assignment System",
    "Progress Tracking",
    "Certificate Generation",
    "Mentor-Student Matching",
    "Schedule Management",
    "Leaderboard System"
  ],
  technologies: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "React Query",
    "WebSocket",
    "Node.js",
    "",
    ""
  ],
  components: [
    "Dashboard",
    "Course Cards",
    "Video Player",
    "Quiz Interface",
    "Assignment Uploader",
    "Progress Tracker",
    "Certificate Generator",
    "Schedule Calendar",
    "Leaderboard Display"
  ],
  pages: [
    "Home",
    "Courses",
    "Course Details",
    "Course Learning",
    "Mentors",
    "Schedule",
    "Login",
    "Register",
    "Dashboard",
    "Profile",
    "Mentor Request",
    "Mentor Session",
    "Mentor Dashboard",
    "Teacher Dashboard",
    "Student Dashboard",
    "Mentor Admin Dashboard",
    "Course Management",
    "Mentor Management",
    "Document Viewer",
    "Video Session",
    "Quiz Page",
    "Assignment Page",
    "Certificates"
  ],
  services: [
    "Authentication",
    "Course Management",
    "Video Streaming",
    "Quiz Management",
    "Assignment Management",
    "Progress Tracking",
    "Certificate Generation",
    "Mentor Matching",
    "Schedule Management",
    "Leaderboard Management"
  ]
};

class ChatBotService {
  private static instance: ChatBotService;
  private messages: Message[] = [];

  private constructor() {}

  public static getInstance(): ChatBotService {
    if (!ChatBotService.instance) {
      ChatBotService.instance = new ChatBotService();
    }
    return ChatBotService.instance;
  }

  public addMessage(message: Message) {
    this.messages.push(message);
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public clearMessages() {
    this.messages = [];
  }

  public generateBotResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Project Information
    if (message.includes('project') || message.includes('about') || message.includes('info')) {
      return `MentorLink Sphere is ${projectInfo.description}\n\nKey Features:\n${projectInfo.features.map(f => `- ${f}`).join('\n')}\n\nTechnologies Used:\n${projectInfo.technologies.map(t => `- ${t}`).join('\n')}`;
    }

    // Features
    if (message.includes('feature') || message.includes('what can') || message.includes('capability')) {
      return `MentorLink Sphere offers these key features:\n${projectInfo.features.map(f => `- ${f}`).join('\n')}`;
    }

    // Technologies
    if (message.includes('tech') || message.includes('stack') || message.includes('built')) {
      return `The project is built using:\n${projectInfo.technologies.map(t => `- ${t}`).join('\n')}`;
    }

    // Components
    if (message.includes('component') || message.includes('part') || message.includes('section')) {
      return `The main components include:\n${projectInfo.components.map(c => `- ${c}`).join('\n')}`;
    }

    // Pages
    if (message.includes('page') || message.includes('route') || message.includes('screen')) {
      return `Available pages in the application:\n${projectInfo.pages.map(p => `- ${p}`).join('\n')}`;
    }

    // Services
    if (message.includes('service') || message.includes('api') || message.includes('backend')) {
      return `The application provides these services:\n${projectInfo.services.map(s => `- ${s}`).join('\n')}`;
    }

    // Help
    if (message.includes('help') || message.includes('assist') || message.includes('guide')) {
      return `I can help you with information about:\n- Project Overview\n- Features\n- Technologies\n- Components\n- Pages\n- Services\n\nJust ask about any of these topics!`;
    }

    // Greeting
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! I'm your MentorLink Sphere assistant. I can help you learn about the project, its features, and how to use it. What would you like to know?`;
    }

    // Default response
    return `I understand you're asking about "${userMessage}". I can help you with information about the project, its features, technologies, components, pages, or services. What specific aspect would you like to know more about?`;
  }
}

export const chatBotService = ChatBotService.getInstance(); 