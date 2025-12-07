import { useState, useEffect } from 'react';
import { useActivity } from '@/contexts/ActivityContext';
import { useToast } from '@/components/ui/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ExamTimer } from '@/components/dashboard/ExamTimer';
import { ActivitySummary } from '@/components/dashboard/ActivitySummary';
import { RiskDisplay } from '@/components/dashboard/RiskDisplay';
import { ExamTabContent } from '@/components/dashboard/ExamTabContent';

const StudentDashboard = () => {
  const { 
    isMonitoring, 
    startMonitoring, 
    stopMonitoring, 
    events, 
    totalRiskScore,
    riskLevel,
    totalEvents,
    addTestEvent,
    useDataset,
    consecutiveCopyAttempts,
    consecutiveFocusChanges,
    currentStudentId,
    setCurrentStudentId
  } = useActivity();

  const { toast } = useToast();
  const [examStarted, setExamStarted] = useState(false);
  
  // Set the current student ID when the component mounts
  useEffect(() => {
    // In a real application, you would get the student ID from authentication
    // For now, we'll generate a temporary ID
    const tempStudentId = `student_${Date.now()}`;
    setCurrentStudentId(tempStudentId);
    
    return () => {
      setCurrentStudentId(null);
    };
  }, [setCurrentStudentId]);
  
  const handleStartExam = () => {
    setExamStarted(true);
    startMonitoring();
  };
  
  const handleEndExam = () => {
    setExamStarted(false);
    stopMonitoring();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <DashboardHeader 
        examStarted={examStarted} 
        useDataset={useDataset} 
      />

      <main className="container mx-auto px-4 pt-0 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ExamTimer 
            examStarted={examStarted}
            startExam={handleStartExam}
            endExam={handleEndExam}
          />
          
          <ActivitySummary 
            examStarted={examStarted}
            totalEvents={totalEvents}
            addTestEvent={addTestEvent}
          />
          
          <RiskDisplay 
            riskLevel={riskLevel}
            totalRiskScore={totalRiskScore}
            consecutiveCopyAttempts={consecutiveCopyAttempts}
            consecutiveFocusChanges={consecutiveFocusChanges}
          />
        </div>
        
        <ExamTabContent events={events} />
      </main>
    </div>
  );
};

export default StudentDashboard;