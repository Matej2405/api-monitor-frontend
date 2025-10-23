import { useState, useEffect } from 'react';
import { css } from '../../styled-system/css';
import { requestsAPI, type APIRequest } from '../services/api';

function RequestsTable() {
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    method: '',
    search: '',
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
      {/* Header */}
      <div className={css({ marginBottom: '2rem' })}>
        <h1 className={css({ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' })}>
          API Requests - Table View
        </h1>
        <p className={css({ color: 'rgba(255,255,255,0.6)' })}>
          View and sort your API requests in a table format
        </p>
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
        <input
          type="text"
          placeholder="Search by path..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className={css({
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            flex: '1',
            minWidth: '200px',
            '&:focus': {
              outline: 'none',
              border: '1px solid rgba(139, 92, 246, 0.6)',
            },
          })}
        />

        <select
          value={filters.method}
          onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          className={css({
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: 'white',
            cursor: 'pointer',
          })}
        >
          <option value="">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* Loading State */}
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

      {/* Table */}
      {!loading && requests.length > 0 && (
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
                <th className={tableHeaderStyle}>Method</th>
                <th className={tableHeaderStyle}>Response</th>
                <th className={tableHeaderStyle}>Path</th>
                <th 
                  className={`${tableHeaderStyle} ${css({ cursor: 'pointer', '&:hover': { background: 'rgba(139, 92, 246, 0.2)' } })}`}
                  onClick={() => handleSort('response_time')}
                >
                  Response Time {filters.sort_by === 'response_time' && (filters.order === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className={`${tableHeaderStyle} ${css({ cursor: 'pointer', '&:hover': { background: 'rgba(139, 92, 246, 0.2)' } })}`}
                  onClick={() => handleSort('created_at')}
                >
                  Created At {filters.sort_by === 'created_at' && (filters.order === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr
                  key={request.id}
                  className={css({
                    borderBottom: index !== requests.length - 1 ? '1px solid rgba(139, 92, 246, 0.1)' : 'none',
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

export default RequestsTable;