import { websocketService } from './websocket';

export interface CourseUpdate {
  id: string;
  type: 'material' | 'quiz' | 'video' | 'assignment';
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  createdAt: Date;
  url?: string;
}

type UpdateHandler = (update: CourseUpdate) => void;

class CourseUpdatesService {
  private static instance: CourseUpdatesService;
  private updateHandlers: Set<UpdateHandler> = new Set();
  private updates: CourseUpdate[] = [];

  private constructor() {
    // Initialize WebSocket connection
    websocketService.connect('ws://localhost:8082');
    
    // Subscribe to course updates
    websocketService.subscribe('course_update', (data: CourseUpdate) => {
      this.addUpdate(data);
    });
  }

  public static getInstance(): CourseUpdatesService {
    if (!CourseUpdatesService.instance) {
      CourseUpdatesService.instance = new CourseUpdatesService();
    }
    return CourseUpdatesService.instance;
  }

  public addUpdate(update: CourseUpdate) {
    this.updates.push(update);
    this.notifyHandlers(update);
  }

  public getUpdates(courseId?: string): CourseUpdate[] {
    if (courseId) {
      return this.updates.filter(update => update.courseId === courseId);
    }
    return [...this.updates];
  }

  public subscribe(handler: UpdateHandler) {
    this.updateHandlers.add(handler);
    // Send initial updates
    this.updates.forEach(handler);
    return () => this.updateHandlers.delete(handler);
  }

  private notifyHandlers(update: CourseUpdate) {
    this.updateHandlers.forEach(handler => handler(update));
  }

  public createMaterialUpdate(courseId: string, courseName: string, title: string, description: string, url: string) {
    const update: CourseUpdate = {
      id: Date.now().toString(),
      type: 'material',
      title,
      description,
      courseId,
      courseName,
      createdAt: new Date(),
      url
    };
    websocketService.send({ type: 'course_update', data: update });
    this.addUpdate(update);
  }

  public createQuizUpdate(courseId: string, courseName: string, title: string, description: string) {
    const update: CourseUpdate = {
      id: Date.now().toString(),
      type: 'quiz',
      title,
      description,
      courseId,
      courseName,
      createdAt: new Date()
    };
    websocketService.send({ type: 'course_update', data: update });
    this.addUpdate(update);
  }

  public createVideoUpdate(courseId: string, courseName: string, title: string, description: string, url: string) {
    const update: CourseUpdate = {
      id: Date.now().toString(),
      type: 'video',
      title,
      description,
      courseId,
      courseName,
      createdAt: new Date(),
      url
    };
    websocketService.send({ type: 'course_update', data: update });
    this.addUpdate(update);
  }

  public createAssignmentUpdate(courseId: string, courseName: string, title: string, description: string) {
    const update: CourseUpdate = {
      id: Date.now().toString(),
      type: 'assignment',
      title,
      description,
      courseId,
      courseName,
      createdAt: new Date()
    };
    websocketService.send({ type: 'course_update', data: update });
    this.addUpdate(update);
  }
}

export const courseUpdatesService = CourseUpdatesService.getInstance(); 