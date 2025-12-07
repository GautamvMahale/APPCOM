import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';

const API_BASE_URL = 'http://localhost:5000/api';

export class ApiService {
  // Student operations
  static async createStudent(studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore'>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create student');
    }
    
    return await response.json();
  }

  static async getAllStudents(): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/students`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    
    return await response.json();
  }

  static async getStudentById(studentId: string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch student');
    }
    
    return await response.json();
  }

  static async updateStudentStatus(studentId: string, status: 'active' | 'flagged' | 'high-risk' | 'offline'): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update student status');
    }
    
    return await response.json();
  }

  static async updateStudentRiskScore(studentId: string, riskScore: number): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/risk-score`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ riskScore }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update student risk score');
    }
    
    return await response.json();
  }

  // Activity Event operations
  static async createActivityEvent(eventData: { 
    studentId: string; 
    timestamp: Date | string; 
    type: string; 
    details?: string; 
    riskScore: number 
  }): Promise<ActivityEvent> {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create activity event');
    }
    
    return await response.json();
  }

  static async getStudentActivityEvents(studentId: string): Promise<ActivityEvent[]> {
    const response = await fetch(`${API_BASE_URL}/activities/student/${studentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch student activity events');
    }
    
    return await response.json();
  }

  static async getAllActivityEvents(): Promise<(ActivityEvent & { studentName: string, exam: string })[]> {
    const response = await fetch(`${API_BASE_URL}/activities`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch all activity events');
    }
    
    return await response.json();
  }

  // Authentication operations
  static async verifyStudentCredentials(studentId: string, password: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/students/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, password }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to verify credentials');
    }
    
    const result = await response.json();
    return result.valid;
  }
}