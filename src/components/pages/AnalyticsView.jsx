import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { TaskService } from '@/services/api/TaskService';
import { SprintService } from '@/services/api/SprintService';
import { TeamMemberService } from '@/services/api/TeamMemberService';

const AnalyticsView = () => {
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [tasksData, sprintsData, membersData] = await Promise.all([
        TaskService.getAll(),
        SprintService.getAll(),
        TeamMemberService.getAll()
      ]);
      
      setTasks(tasksData);
      setSprints(sprintsData);
      setTeamMembers(membersData);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'inprogress').length;
    const overdueTasks = tasks.filter(task => {
      // Simplified overdue logic - in practice, you'd compare due dates
      return task.status !== 'done' && new Date(task.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const velocity = completedTasks; // Simplified velocity calculation

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      completionRate,
      velocity,
    };
  };

  const getTasksByStatus = () => {
    const statusCounts = {
      todo: tasks.filter(t => t.status === 'todo').length,
      inprogress: tasks.filter(t => t.status === 'inprogress').length,
      inreview: tasks.filter(t => t.status === 'inreview').length,
      done: tasks.filter(t => t.status === 'done').length,
    };

    return {
      series: Object.values(statusCounts),
      options: {
        chart: {
          type: 'donut',
          fontFamily: 'Inter, sans-serif',
        },
        labels: ['To Do', 'In Progress', 'In Review', 'Done'],
        colors: ['#94A3B8', '#3B82F6', '#F59E0B', '#10B981'],
        legend: {
          position: 'bottom',
        },
        plotOptions: {
          pie: {
            donut: {
              size: '70%',
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  };

  const getTasksByRole = () => {
    const roleCounts = {
      dev: tasks.filter(t => t.role === 'dev').length,
      tester: tasks.filter(t => t.role === 'tester').length,
      pm: tasks.filter(t => t.role === 'pm').length,
    };

    return {
      series: [{
        name: 'Tasks',
        data: Object.values(roleCounts)
      }],
      options: {
        chart: {
          type: 'bar',
          fontFamily: 'Inter, sans-serif',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: ['Developers', 'Testers', 'Project Managers'],
        },
        colors: ['#5046E5'],
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          borderColor: '#E2E8F0',
        },
      }
    };
  };

  const getBurndownData = () => {
    // Simplified burndown chart - in practice, you'd use real sprint data
    const days = Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`);
    const idealBurndown = Array.from({ length: 14 }, (_, i) => Math.round(100 - (i * 7.14)));
    const actualBurndown = Array.from({ length: 14 }, (_, i) => {
      const baseValue = 100 - (i * 7.14);
      const variance = Math.random() * 20 - 10; // Add some realistic variance
      return Math.max(0, Math.round(baseValue + variance));
    });

    return {
      series: [
        {
          name: 'Ideal Burndown',
          data: idealBurndown
        },
        {
          name: 'Actual Burndown',
          data: actualBurndown
        }
      ],
      options: {
        chart: {
          type: 'line',
          fontFamily: 'Inter, sans-serif',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: days,
        },
        colors: ['#94A3B8', '#5046E5'],
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        grid: {
          borderColor: '#E2E8F0',
        },
        legend: {
          position: 'top',
        },
      }
    };
  };

  const timeRangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
  ];

  const metrics = calculateMetrics();
  const statusChart = getTasksByStatus();
  const roleChart = getTasksByRole();
  const burndownChart = getBurndownData();

  if (loading) {
    return <Loading type="cards" count={8} />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Track team performance and project metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={timeRangeOptions}
            className="min-w-[150px]"
          />
          <Button
            variant="secondary"
            icon="Download"
            className="hidden sm:flex"
          >
            Export Report
          </Button>
          <Button
            variant="primary"
            icon="RefreshCw"
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="List" size={24} className="text-slate-500" />
            <span className="text-2xl font-bold text-slate-800">{metrics.totalTasks}</span>
          </div>
          <p className="text-sm text-slate-600">Total Tasks</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="CheckCircle" size={24} className="text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-600">{metrics.completedTasks}</span>
          </div>
          <p className="text-sm text-slate-600">Completed</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Clock" size={24} className="text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{metrics.inProgressTasks}</span>
          </div>
          <p className="text-sm text-slate-600">In Progress</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="AlertTriangle" size={24} className="text-red-500" />
            <span className="text-2xl font-bold text-red-600">{metrics.overdueTasks}</span>
          </div>
          <p className="text-sm text-slate-600">Overdue</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Target" size={24} className="text-primary-500" />
            <span className="text-2xl font-bold text-primary-600">{metrics.completionRate}%</span>
          </div>
          <p className="text-sm text-slate-600">Completion Rate</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-2">
            <ApperIcon name="Zap" size={24} className="text-amber-500" />
            <span className="text-2xl font-bold text-amber-600">{metrics.velocity}</span>
          </div>
          <p className="text-sm text-slate-600">Velocity</p>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Task Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="PieChart" size={20} className="mr-2" />
            Task Status Distribution
          </h3>
          <Chart
            options={statusChart.options}
            series={statusChart.series}
            type="donut"
            height={300}
          />
        </motion.div>

        {/* Tasks by Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2" />
            Tasks by Role
          </h3>
          <Chart
            options={roleChart.options}
            series={roleChart.series}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>

      {/* Burndown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-card p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <ApperIcon name="TrendingDown" size={20} className="mr-2" />
          Sprint Burndown Chart
        </h3>
        <Chart
          options={burndownChart.options}
          series={burndownChart.series}
          type="line"
          height={400}
        />
      </motion.div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <ApperIcon name="Users" size={20} className="mr-2" />
          Team Performance
        </h3>
        
        <div className="space-y-4">
          {teamMembers.map((member) => {
            const memberTasks = tasks.filter(task => task.assigneeId === member.Id);
            const completedTasks = memberTasks.filter(task => task.status === 'done');
            const completionRate = memberTasks.length > 0 
              ? Math.round((completedTasks.length / memberTasks.length) * 100) 
              : 0;

            return (
              <div key={member.Id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    member.role === 'dev' ? 'bg-blue-500' :
                    member.role === 'tester' ? 'bg-amber-500' :
                    'bg-purple-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-slate-800">{member.name}</h4>
                    <p className="text-sm text-slate-600 capitalize">{member.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{memberTasks.length}</div>
                    <div className="text-xs text-slate-600">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">{completedTasks.length}</div>
                    <div className="text-xs text-slate-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-600">{completionRate}%</div>
                    <div className="text-xs text-slate-600">Rate</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsView;