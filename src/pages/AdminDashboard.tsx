import { useState, useEffect, useMemo } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useToast } from '@/components/ui/use-toast';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabNavigation } from '@/components/admin/AdminTabNavigation';
import { Student } from '@/types/student';
import { ActivityEvent } from '@/types/activity';
import { ApiService } from '@/services/apiService';
import { allDemoStudents, addDemoStudent } from '@/data/demoStudents';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { 
    events, 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring,
    totalRiskScore,
    riskLevel,
    totalEvents,
    addTestEvent,
    useDataset,
    toggleDatasetUse,
    currentStudentId,
    setCurrentStudentId
  } = useActivity();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDemoMode, setUseDemoMode] = useState(false);
  
  // Load students from API when component mounts
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const studentsFromAPI = await ApiService.getAllStudents();
        setStudents(studentsFromAPI);
        setUseDemoMode(false);
      } catch (error) {
        console.error('Error loading students from API, using demo data:', error);
        // Fallback to demo data
        setStudents(allDemoStudents);
        setUseDemoMode(true);
        toast({
          title: "Demo Mode",
          description: "Using demo student data for demonstration purposes.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);
  
  // Save activity events to database
  useEffect(() => {
    if (events.length > 0 && currentStudentId && !useDemoMode) {
      const saveActivityEvents = async () => {
        try {
          // Save the latest events to database
          const latestEvents = events.slice(0, 5); // Save last 5 events
          
          for (const event of latestEvents) {
            await ApiService.createActivityEvent({
              studentId: currentStudentId,
              timestamp: event.timestamp,
              type: event.type,
              details: event.details,
              riskScore: event.riskScore
            });
          }
        } catch (error) {
          console.error('Error saving activity events:', error);
        }
      };

      saveActivityEvents();
    }
  }, [events, currentStudentId, useDemoMode]);
  
  // Update student status and risk score based on activity events
  useEffect(() => {
    if (events.length > 0 && currentStudentId) {
      setStudents(prevStudents => {
        return prevStudents.map(student => {
          if (student.id === currentStudentId) {
            // Update student based on latest event
            const updatedStudent = { ...student };
            
            // Set status to active when monitoring starts
            if (isMonitoring && student.status !== 'active' && student.status !== 'flagged' && student.status !== 'high-risk') {
              updatedStudent.status = 'active';
              // Update in database if not in demo mode
              if (!useDemoMode) {
                ApiService.updateStudentStatus(currentStudentId, 'active');
              }
            }
            
            // Update risk score based on events
            if (totalRiskScore !== undefined) {
              const newRiskScore = Math.min(100, Math.max(0, totalRiskScore));
              updatedStudent.riskScore = newRiskScore;
              
              // Update in database if not in demo mode
              if (!useDemoMode) {
                ApiService.updateStudentRiskScore(currentStudentId, newRiskScore);
              }
              
              // Update status based on risk score
              if (newRiskScore >= 80) {
                updatedStudent.status = 'high-risk';
                if (!useDemoMode) {
                  ApiService.updateStudentStatus(currentStudentId, 'high-risk');
                }
              } else if (newRiskScore >= 50) {
                updatedStudent.status = 'flagged';
                if (!useDemoMode) {
                  ApiService.updateStudentStatus(currentStudentId, 'flagged');
                }
              }
            }
            
            return updatedStudent;
          }
          return student;
        });
      });
    }
  }, [events, currentStudentId, isMonitoring, totalRiskScore, useDemoMode]);
  
  // Calculate real-time statistics based on actual data
  const stats = useMemo(() => {
    // Count active students (those with active status)
    const activeStudents = students.filter(student => student.status === 'active').length;
    
    // Calculate average risk score from students with risk scores
    const studentsWithRisk = students.filter(student => student.riskScore !== undefined && student.riskScore > 0);
    const averageRiskScore = studentsWithRisk.length > 0 
      ? studentsWithRisk.reduce((sum, student) => sum + (student.riskScore || 0), 0) / studentsWithRisk.length
      : 0;
    
    // Count flagged sessions (students with high-risk or flagged status)
    const flaggedSessions = students.filter(student => 
      student.status === 'high-risk' || student.status === 'flagged'
    ).length;
    
    // Total sessions is the total number of students
    const totalSessions = students.length;
    
    return {
      activeStudents,
      averageRiskScore,
      flaggedSessions,
      totalSessions
    };
  }, [students]);
  
  // Calculate real-time risk distribution
  const riskDistribution = useMemo(() => {
    const low = students.filter(student => student.status === 'active' && (student.riskScore || 0) < 30).length;
    const medium = students.filter(student => student.status === 'active' && (student.riskScore || 0) >= 30 && (student.riskScore || 0) < 70).length;
    const high = students.filter(student => student.status === 'high-risk' || student.status === 'flagged').length;
    
    return {
      low,
      medium,
      high
    };
  }, [students]);
  
  // Handle creating a new session
  const handleNewSession = () => {
    toast({
      title: "New session created",
      description: `Session has been created successfully.`,
    });
  };
  
  // Handle adding a new student
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'status' | 'timeElapsed' | 'riskScore' | 'password'>) => {
    try {
      let newStudent: Student;
      
      if (useDemoMode) {
        // Add to demo data
        newStudent = addDemoStudent(studentData);
        setStudents([...allDemoStudents]);
        toast({
          title: "Student Added (Demo)",
          description: `${studentData.name} has been added to the student list (Demo Mode).`,
        });
      } else {
        // Create a new student in the database
        newStudent = await ApiService.createStudent(studentData);
        // Update local state
        setStudents(prev => [newStudent, ...prev]);
        toast({
          title: "Student Added",
          description: `${studentData.name} has been added to the student list.`,
        });
      }
      
      return newStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
      return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-4">
            <p>Loading students...</p>
          </div>
        )}
        
        {useDemoMode && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Mode:</strong> Using pre-loaded student data for demonstration purposes.
            </p>
          </div>
        )}
        
        <AdminTabNavigation
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          stats={stats}
          riskDistribution={riskDistribution}
          isMonitoring={isMonitoring}
          events={events} // Use real-time activity events
          useDataset={useDataset}
          startMonitoring={startMonitoring}
          stopMonitoring={stopMonitoring}
          toggleDatasetUse={toggleDatasetUse}
          addTestEvent={addTestEvent}
          handleNewSession={handleNewSession}
          students={students}
          onAddStudent={handleAddStudent}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;