import { useState, useEffect } from 'react';
import { css } from '../../styled-system/css';
import { requestsAPI, type APIRequest } from '../services/api';
import { Clock, Zap } from 'lucide-react';

function Requests() {
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'table'>('list'); // NEW!
  const [filters, setFilters] = useState({
    method: '',
    search: '',
    response_code_range: '',
    start_date: '',
    end_date: '',
    min_response_time: '',
    max_response_time: '',
    sort_by: 'created_at' as 'created_at' | 'response_time',
    order: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort_by: filters.sort_by,
        order: filters.order,
      };
      
      if (filters.method) params.method = filters.method;
      if (filters.search) params.search = filters.search;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.min_response_time) params.min_response_time = filters.min_response_time;
      if (filters.max_response_time) params.max_response_time = filters.max_response_time;
      
      if (filters.response_code_range) {
        if (filters.response_code_range === '2xx') {
          params.min_response_code = 200;
          params.max_response_code = 299;
        } else if (filters.response_code_range === '4xx') {
          params.min_response_code = 400;
          params.max_response_code = 499;
        } else if (filters.response_code_range === '5xx') {
          params.min_response_code = 500;
          params.max_response_code = 599;
        }
      }

      const response = await requestsAPI.getAll(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#3b82f6',
      POST: '#10b981',
      PUT: '#f59e0b',
      DELETE: '#ef4444',
      PATCH: '#8b5cf6',
    };
    return colors[method] || '#6b7280';
  };

  const getResponseColor = (code: number) => {
    if (code >= 200 && code < 300) return '#10b981';
    if (code >= 400 && code < 500) return '#f59e0b';
    if (code >= 500) return '#ef4444';
    return '#6b7280';
  };

  const handleSort = (column: 'created_at' | 'response_time') => {
    if (filters.sort_by === column) {
      setFilters({ ...filters, order: filters.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilters({ ...filters, sort_by: column, order: 'desc' });
    }
  };

  return (
    <div>
      {/* Header Section - Like Figma */}
      <div className={css({ 
        background: 'rgba(26, 23, 38, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(145, 3, 235, 0.3)',
      })}
        style={{ WebkitBackdropFilter: 'blur(10px)' }}
      >
        <div className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' })}>
          <h2 className={css({ fontSize: '1.25rem', fontFamily: 'Michroma, sans-serif' })}>
            Requests
          </h2>
          
          {/* View Toggle - Like Figma */}
          <div className={css({ display: 'flex', gap: '0.5rem' })}>
            <button
              onClick={() => setView('list')}
              className={css({
                background: view === 'list' ? 'rgba(225, 32, 122, 0.2)' : 'transparent',
                border: view === 'list' ? '1px solid rgba(225, 32, 122, 0.6)' : '1px solid rgba(145, 3, 235, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: view === 'list' ? '600' : '400',
                '&:hover': {
                  background: 'rgba(225, 32, 122, 0.1)',
                },
              })}
            >
              List
            </button>
            <button
              onClick={() => setView('table')}
              className={css({
                background: view === 'table' ? 'rgba(225, 32, 122, 0.2)' : 'transparent',
                border: view === 'table' ? '1px solid rgba(225, 32, 122, 0.6)' : '1px solid rgba(145, 3, 235, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 1.5rem',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: view === 'table' ? '600' : '400',
                '&:hover': {
                  background: 'rgba(225, 32, 122, 0.1)',
                },
              })}
            >
              Table
            </button>
          </div>
        </div>

        {/* Filters - All in one row like Figma */}
        <div className={css({ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' })}>
          {/* Sort Dropdown */}
          <select
            value={filters.sort_by}
            onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as any })}
            className={css({
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(145, 3, 235, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
            })}
          >
            <option value="created_at">Last 24h</option>
            <option value="response_time">Response Time</option>
          </select>

          {/* Method Filter */}
          <select
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
            className={css({
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(145, 3, 235, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
            })}
          >
            <option value="">Method: All</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          {/* Response Filter */}
          <select
            value={filters.response_code_range}
            onChange={(e) => setFilters({ ...filters, response_code_range: e.target.value })}
            className={css({
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(145, 3, 235, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
            })}
          >
            <option value="">Response: All</option>
            <option value="2xx">2xx</option>
            <option value="4xx">4xx</option>
            <option value="5xx">5xx</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className={css({ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' })}>
          Loading requests...
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className={css({ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.6)' })}>
          No requests found
        </div>
      )}

      {/* Content - List or Table */}
      {!loading && requests.length > 0 && (
        <>
          {view === 'list' ? (
            // List View
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}>
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={css({
                    background: 'rgba(26, 23, 38, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(145, 3, 235, 0.3)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1px solid rgba(225, 32, 122, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                  })}
                >
                  <div className={css({ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' })}>
                    <span
                      className={css({
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      })}
                      style={{ backgroundColor: getMethodColor(request.method), color: 'white' }}
                    >
                      {request.method}
                    </span>

                    <span
                      className={css({
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      })}
                      style={{ backgroundColor: getResponseColor(request.response_code), color: 'white' }}
                    >
                      {request.response_code}
                    </span>

                    <span className={css({ fontSize: '1.125rem', fontWeight: '500', flex: 1 })}>
                      {request.path}
                    </span>
                  </div>

                  <div className={css({ display: 'flex', gap: '2rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' })}>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                      <Zap size={16} />
                      <span>{request.response_time}ms</span>
                    </div>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '0.5rem' })}>
                      <Clock size={16} />
                      <span>{new Date(request.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Table View
            <div className={css({
              background: 'rgba(26, 23, 38, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(145, 3, 235, 0.3)',
              borderRadius: '12px',
              overflow: 'hidden',
            })}>
              <table className={css({ width: '100%', borderCollapse: 'collapse' })}>
                <thead>
                  <tr className={css({
                    background: 'rgba(145, 3, 235, 0.1)',
                    borderBottom: '1px solid rgba(145, 3, 235, 0.3)',
                  })}>
                    <th className={tableHeaderStyle}>Method</th>
                    <th className={tableHeaderStyle}>Response</th>
                    <th className={tableHeaderStyle}>Name</th>
                    <th 
                      className={`${tableHeaderStyle} ${css({ cursor: 'pointer' })}`}
                      onClick={() => handleSort('response_time')}
                    >
                      Load Time {filters.sort_by === 'response_time' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className={`${tableHeaderStyle} ${css({ cursor: 'pointer' })}`}
                      onClick={() => handleSort('created_at')}
                    >
                      Time {filters.sort_by === 'created_at' && (filters.order === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr
                      key={request.id}
                      className={css({
                        borderBottom: index !== requests.length - 1 ? '1px solid rgba(145, 3, 235, 0.1)' : 'none',
                        transition: 'background 0.2s',
                        '&:hover': {
                          background: 'rgba(145, 3, 235, 0.1)',
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
                          style={{ backgroundColor: getMethodColor(request.method), color: 'white' }}
                        >
                          {request.method}
                        </span>
                      </td>
                      <td className={tableCellStyle}>
                        <span
                          className={css({
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'inline-block',
                          })}
                          style={{ backgroundColor: getResponseColor(request.response_code), color: 'white' }}
                        >
                          {request.response_code}
                        </span>
                      </td>
                      <td className={tableCellStyle}>
                        <span className={css({ fontFamily: 'monospace' })}>{request.path}</span>
                      </td>
                      <td className={tableCellStyle}>
                        <span className={css({ fontWeight: '500' })}>{request.response_time}ms</span>
                      </td>
                      <td className={tableCellStyle}>
                        {new Date(request.created_at).toLocaleString()}
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

export default Requests;