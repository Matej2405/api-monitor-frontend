import { useState, useEffect } from 'react';
import { css } from '../../styled-system/css';
import { problemsAPI, type Problem } from '../services/api';
import { AlertCircle, Clock } from 'lucide-react';

function Problems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    problem_type: '',
    severity: '',
    sort_by: 'created_at' as 'created_at' | 'severity',
    order: 'desc' as 'asc' | 'desc',
  });
  const [view, setView] = useState<'list' | 'table'>('list'); // NEW!

  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: filters.sort_by,
        order: filters.order,
      };
      
      if (filters.problem_type) params.problem_type = filters.problem_type;
      if (filters.severity) params.severity = filters.severity;

      const response = await problemsAPI.getAll(params);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProblemTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      error_5xx: '#ef4444',
      error_4xx: '#f59e0b',
      slow_response: '#eab308',
      timeout: '#dc2626',
      rate_limit: '#f97316',
    };
    return colors[type] || '#6b7280';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: '#dc2626',
      high: '#f97316',
      medium: '#f59e0b',
      low: '#84cc16',
    };
    return colors[severity] || '#6b7280';
  };

  const getProblemTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      error_5xx: '5xx Server Error',
      error_4xx: '4xx Client Error',
      slow_response: 'Slow Response',
      timeout: 'Timeout',
      rate_limit: 'Rate Limited',
    };
    return labels[type] || type;
  };

  return (
    <div>
      {/* Header */}
      <div className={css({ marginBottom: '2rem' })}>
        <h1 className={css({ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' })}>
          API Problems
        </h1>
        <p className={css({ color: 'rgba(255,255,255,0.6)' })}>
          Track and monitor API issues and errors
        </p>
      </div>

      {/* Stats Cards */}
      <div className={css({ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      })}>
        <StatCard 
          label="Total Problems" 
          value={problems.length} 
          color="#a855f7"
        />
        <StatCard 
          label="Critical" 
          value={problems.filter(p => p.severity === 'critical').length} 
          color="#dc2626"
        />
        <StatCard 
          label="High Priority" 
          value={problems.filter(p => p.severity === 'high').length} 
          color="#f97316"
        />
        <StatCard 
          label="Medium/Low" 
          value={problems.filter(p => p.severity === 'medium' || p.severity === 'low').length} 
          color="#f59e0b"
        />
      </div>

      {/* Filters */}
      <div className={css({
        background: 'rgba(26, 17, 40, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
      })}>
        {/* Problem Type Filter */}
        <select
          value={filters.problem_type}
          onChange={(e) => setFilters({ ...filters, problem_type: e.target.value })}
          className={css({
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            cursor: 'pointer',
            flex: '1',
            minWidth: '150px',
          })}
        >
          <option value="">All Problem Types</option>
          <option value="error_5xx">5xx Server Error</option>
          <option value="error_4xx">4xx Client Error</option>
          <option value="slow_response">Slow Response</option>
          <option value="timeout">Timeout</option>
          <option value="rate_limit">Rate Limited</option>
        </select>

        {/* Severity Filter */}
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className={css({
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            cursor: 'pointer',
            flex: '1',
            minWidth: '150px',
          })}
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Sort By */}
        <select
          value={filters.sort_by}
          onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
          className={css({
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            cursor: 'pointer',
          })}
        >
          <option value="created_at">Sort by Time</option>
          <option value="severity">Sort by Severity</option>
        </select>

        {/* Order */}
        <button
          onClick={() => setFilters({ ...filters, order: filters.order === 'asc' ? 'desc' : 'asc' })}
          className={css({
            background: 'rgba(168, 85, 247, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              background: 'rgba(168, 85, 247, 0.3)',
            },
          })}
        >
          {filters.order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
      </div>
      {/* View Toggle - NEW! */}
      <div className={css({ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        justifyContent: 'flex-end',
      })}>
        <button
          onClick={() => setView('list')}
          className={css({
            background: view === 'list' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(26, 17, 40, 0.6)',
            border: view === 'list' ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1.5rem',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: view === 'list' ? '600' : '400',
            '&:hover': {
              background: 'rgba(168, 85, 247, 0.2)',
            },
          })}
        >
          List View
        </button>
        <button
          onClick={() => setView('table')}
          className={css({
            background: view === 'table' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(26, 17, 40, 0.6)',
            border: view === 'table' ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1.5rem',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontWeight: view === 'table' ? '600' : '400',
            '&:hover': {
              background: 'rgba(168, 85, 247, 0.2)',
            },
          })}
        >
          Table View
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={css({ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' })}>
          Loading problems...
        </div>
      )}

      {/* Empty State */}
      {!loading && problems.length === 0 && (
        <div className={css({ 
          textAlign: 'center', 
          padding: '4rem',
          background: 'rgba(26, 17, 40, 0.4)',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        })}>
          <div className={css({ fontSize: '3rem', marginBottom: '1rem' })}>🎉</div>
          <h3 className={css({ fontSize: '1.5rem', marginBottom: '0.5rem' })}>No Problems Found!</h3>
          <p className={css({ color: 'rgba(255,255,255,0.6)' })}>
            All your API requests are running smoothly
          </p>
        </div>
      )}

     {/* Problems List/Table */}
{!loading && problems.length > 0 && (
  <>
    {view === 'list' ? (
      // List View
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}>
        {problems.map((problem) => (
          <div
            key={problem.id}
            className={css({
              background: 'rgba(26, 17, 40, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'all 0.3s',
              '&:hover': {
                border: '1px solid rgba(139, 92, 246, 0.6)',
                transform: 'translateY(-2px)',
              },
            })}
          >
            <div className={css({ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' })}>
              <AlertCircle 
                size={24} 
                style={{ color: getSeverityColor(problem.severity) }}
              />

              <span
                className={css({
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                })}
                style={{ backgroundColor: getProblemTypeColor(problem.problem_type), color: 'white' }}
              >
                {getProblemTypeLabel(problem.problem_type)}
              </span>

              <span
                className={css({
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                })}
                style={{ backgroundColor: getSeverityColor(problem.severity), color: 'white' }}
              >
                {problem.severity}
              </span>

              <div className={css({ 
                marginLeft: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem',
              })}>
                <Clock size={16} />
                {new Date(problem.created_at).toLocaleString()}
              </div>
            </div>

            <p className={css({ color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' })}>
              {problem.description}
            </p>

            <p className={css({ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' })}>
              Request ID: #{problem.request_id}
            </p>
          </div>
        ))}
      </div>
    ) : (
      // Table View - NEW!
      <div className={css({
        background: 'rgba(26, 17, 40, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        overflow: 'hidden',
      })}>
        <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
          <thead>
            <tr className={css({
              background: 'rgba(139, 92, 246, 0.1)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
            })}>
              <th className={tableHeaderStyle}>Problem Type</th>
              <th className={tableHeaderStyle}>Severity</th>
              <th className={tableHeaderStyle}>Description</th>
              <th className={tableHeaderStyle}>Request ID</th>
              <th className={tableHeaderStyle}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className={css({
                  borderBottom: index !== problems.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
                  transition: 'background 0.2s',
                  '&:hover': {
                    background: 'rgba(139, 92, 246, 0.1)',
                  },
                })}
              >
                <td className={tableCellStyle}>
                  <span
                    className={css({
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'inline-block',
                    })}
                    style={{ backgroundColor: getProblemTypeColor(problem.problem_type), color: 'white' }}
                  >
                    {getProblemTypeLabel(problem.problem_type)}
                  </span>
                </td>
                <td className={tableCellStyle}>
                  <span
                    className={css({
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      display: 'inline-block',
                    })}
                    style={{ backgroundColor: getSeverityColor(problem.severity), color: 'white' }}
                  >
                    {problem.severity}
                  </span>
                </td>
                <td className={tableCellStyle}>
                  {problem.description}
                </td>
                <td className={tableCellStyle}>
                  <span className={css({ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)' })}>
                    #{problem.request_id}
                  </span>
                </td>
                <td className={tableCellStyle}>
                  {new Date(problem.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
)}
 </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className={css({
      background: 'rgba(26, 17, 40, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
    })}>
      <div className={css({ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' })}>
        {label}
      </div>
      <div 
        className={css({ fontSize: '2rem', fontWeight: 'bold' })}
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
const tableHeaderStyle = css({
  padding: '1rem',
  textAlign: 'left',
  fontWeight: '600',
  color: 'rgba(255,255,255,0.9)',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const tableCellStyle = css({
  padding: '1rem',
  color: 'rgba(255,255,255,0.8)',
});

export default Problems;