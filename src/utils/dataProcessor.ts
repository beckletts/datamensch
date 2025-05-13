import { TrainingRecord } from '../types/TrainingData';

export const calculateCompletionRates = (data: TrainingRecord[]) => {
  console.log('TOTAL RECORDS TO PROCESS:', data.length);
  
  // First, identify and group webinars by course title
  const webinarCourses = new Set<string>();
  
  const categoryCounts = {
    liveWebinar: 0,
    recording: 0,
    eLearning: 0
  };
  
  const successCounts = {
    liveWebinar: 0,
    recording: 0,
    eLearning: 0
  };
  
  // Find all unique webinar course titles
  data.forEach(record => {
    if (record.course.toLowerCase().includes('webinar')) {
      webinarCourses.add(record.course);
    }
  });
  
  // Count total webinar enrollments - each row with a webinar course is one enrollment
  // This is the key change - we're counting all rows that have 'webinar' in the course title
  categoryCounts.liveWebinar = data.filter(record => 
    record.course.toLowerCase().includes('webinar')
  ).length;
  
  // For webinars, all enrollments count as success
  successCounts.liveWebinar = categoryCounts.liveWebinar;
  
  console.log('WEBINAR DEBUGGING:');
  console.log('Total webinar courses:', webinarCourses.size);
  console.log('Total webinar enrollments:', categoryCounts.liveWebinar);
  console.log('All webinar courses:', Array.from(webinarCourses));
  
  // Count recordings and eLearning
  data.forEach(record => {
    if (record.course.toLowerCase().includes('recording')) {
      categoryCounts.recording++;
      if (record.status === 'Completed') {
        successCounts.recording++;
      }
    } else if (!record.course.toLowerCase().includes('webinar')) {
      categoryCounts.eLearning++;
      if (record.status === 'Completed') {
        successCounts.eLearning++;
      }
    }
  });
  
  console.log('FINAL COUNTS:', categoryCounts);
  
  return {
    liveWebinar: categoryCounts.liveWebinar > 0 ? (successCounts.liveWebinar / categoryCounts.liveWebinar) * 100 : 0,
    recording: categoryCounts.recording > 0 ? (successCounts.recording / categoryCounts.recording) * 100 : 0,
    eLearning: categoryCounts.eLearning > 0 ? (successCounts.eLearning / categoryCounts.eLearning) * 100 : 0
  };
};

export const calculateGeographicDistribution = (data: TrainingRecord[]) => {
  const ukCount = data.filter(record => 
    record.centreCountry.toLowerCase() === 'uk' || 
    record.centreCountry.toLowerCase() === 'united kingdom'
  ).length;
  
  return {
    uk: ukCount,
    international: data.length - ukCount
  };
};

export const calculateEngagementMetrics = (data: TrainingRecord[]) => {
  if (data.length === 0) return { timeSpent: 0, progressPercentage: 0 };
  
  const totalTimeSpent = data.reduce((sum, record) => sum + record.timeSpentMinutes, 0);
  const totalProgress = data.reduce((sum, record) => sum + record.progressPercentage, 0);
  
  return {
    timeSpent: totalTimeSpent / data.length,
    progressPercentage: totalProgress / data.length
  };
};

export const getMonthlyBreakdown = (data: TrainingRecord[]) => {
  // Check if we have data spanning multiple months
  const months = new Set<string>();
  
  data.forEach(record => {
    if (record.enrollmentDate) {
      const date = new Date(record.enrollmentDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    }
  });
  
  // If we only have one month, return null
  if (months.size <= 1) {
    return null;
  }
  
  // Group data by month
  const monthlyData: Record<string, { 
    month: string, 
    displayName: string,
    total: number,
    completed: number,
    inProgress: number,
    notStarted: number,
    avgEngagement: number
  }> = {};
  
  data.forEach(record => {
    if (record.enrollmentDate) {
      const date = new Date(record.enrollmentDate);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const displayName = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          month: monthYear,
          displayName,
          total: 0,
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          avgEngagement: 0
        };
      }
      
      monthlyData[monthYear].total += 1;
      
      if (record.status === 'Completed') {
        monthlyData[monthYear].completed += 1;
      } else if (record.status === 'In Progress') {
        monthlyData[monthYear].inProgress += 1;
      } else if (record.status === 'Not Started') {
        monthlyData[monthYear].notStarted += 1;
      }
      
      // Update average engagement (progressPercentage)
      const currentTotal = monthlyData[monthYear].avgEngagement * (monthlyData[monthYear].total - 1);
      monthlyData[monthYear].avgEngagement = (currentTotal + record.progressPercentage) / monthlyData[monthYear].total;
    }
  });
  
  // Convert to array and sort by month
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

// Function to count enrollments for a specific webinar by exact course title
export const countWebinarEnrollments = (data: TrainingRecord[], webinarName: string) => {
  // Count only entries with the exact course title
  return data.filter(record => record.course === webinarName).length;
};

// Function to get webinar enrollment stats
export const getWebinarEnrollmentStats = (data: TrainingRecord[]) => {
  // Group all records by course title
  const courseEnrollmentCounts: Record<string, number> = {};
  
  // Only process webinar courses
  data.forEach(record => {
    if (record.course.toLowerCase().includes('webinar')) {
      if (!courseEnrollmentCounts[record.course]) {
        courseEnrollmentCounts[record.course] = 0;
      }
      courseEnrollmentCounts[record.course]++;
    }
  });
  
  // Sort webinar courses by enrollment count in descending order
  const sortedWebinars = Object.entries(courseEnrollmentCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([course, count]) => ({ course, count }));
  
  // Get the total count from all webinars
  const totalWebinarEnrollments = sortedWebinars.reduce((sum, item) => sum + item.count, 0);
  
  return {
    totalWebinarEnrollments,
    webinarDetails: sortedWebinars
  };
}; 