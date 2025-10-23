import { useState, useEffect } from 'react';
import { css } from '../../styled-system/css';
import { requestsAPI, type APIRequest } from '../services/api';
import { Clock, Zap } from 'lucide-react';

function RequestsList() {
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
  method: '',
  search: '',
  response_code_range: '',
  start_date: '', // NEW!
  end_date: '', // NEW!
  min_response_time: '', // NEW!
  max_response_time: '', // NEW!
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
    
    // Handle date range filtering - NEW!
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    
    // Handle response time filtering - NEW!
    if (filters.min_response_time) params.min_response_time = filters.min_response_time;
    if (filters.max_response_time) params.max_response_time = filters.max_response_time;
    
    // Handle response code range filtering
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

  return (
    <div>
      {/* Header */}
      <div className={css({ marginBottom: '2rem' })}>
        <h1 className={css({ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' })}>
          API Requests - List View
        </h1>
        <p className={css({ color: 'rgba(255,255,255,0.6)' })}>
          Monitor your API requests in real-time
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
  alignItems: 'center',
})}>
  {/* Search */}
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

  {/* Method Filter */}
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

  {/* Response Code Filter - NEW! */}
  <select
    value={filters.response_code_range}
    onChange={(e) => setFilters({ ...filters, response_code_range: e.target.value })}
    className={css({
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      cursor: 'pointer',
    })}
  >
    <option value="">All Response Codes</option>
    <option value="2xx">2xx Success</option>
    <option value="4xx">4xx Client Error</option>
    <option value="5xx">5xx Server Error</option>
  </select>
  {/* Date Range Filters - NEW! */}
<div className={css({ display: 'flex', gap: '0.5rem', alignItems: 'center' })}>
  <label className={css({ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>
    From:
  </label>
  <input
    type="datetime-local"
    value={filters.start_date}
    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
    className={css({
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      cursor: 'pointer',
      '&::-webkit-calendar-picker-indicator': {
        filter: 'invert(1)',
      },
    })}
  />
</div>

<div className={css({ display: 'flex', gap: '0.5rem', alignItems: 'center' })}>
  <label className={css({ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>
    To:
  </label>
  <input
    type="datetime-local"
    value={filters.end_date}
    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
    className={css({
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      cursor: 'pointer',
      '&::-webkit-calendar-picker-indicator': {
        filter: 'invert(1)',
      },
    })}
  />
</div>

{/* Response Time Range - NEW! */}
<div className={css({ display: 'flex', gap: '0.5rem', alignItems: 'center' })}>
  <label className={css({ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>
    Min (ms):
  </label>
  <input
    type="number"
    placeholder="0"
    value={filters.min_response_time}
    onChange={(e) => setFilters({ ...filters, min_response_time: e.target.value })}
    className={css({
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      width: '100px',
      '&:focus': {
        outline: 'none',
        border: '1px solid rgba(139, 92, 246, 0.6)',
      },
    })}
  />
</div>

<div className={css({ display: 'flex', gap: '0.5rem', alignItems: 'center' })}>
  <label className={css({ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', whiteSpace: 'nowrap' })}>
    Max (ms):
  </label>
  <input
    type="number"
    placeholder="5000"
    value={filters.max_response_time}
    onChange={(e) => setFilters({ ...filters, max_response_time: e.target.value })}
    className={css({
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      width: '100px',
      '&:focus': {
        outline: 'none',
        border: '1px solid rgba(139, 92, 246, 0.6)',
      },
    })}
  />
</div>

{/* Clear Filters Button - BONUS! */}
{(filters.start_date || filters.end_date || filters.method || filters.response_code_range || 
  filters.search || filters.min_response_time || filters.max_response_time) && (
  <button
    onClick={() => setFilters({
      method: '',
      search: '',
      response_code_range: '',
      start_date: '',
      end_date: '',
      min_response_time: '',
      max_response_time: '',
      sort_by: 'created_at',
      order: 'desc',
    })}
    className={css({
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.4)',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap',
      '&:hover': {
        background: 'rgba(239, 68, 68, 0.3)',
      },
    })}
  >
    Clear Filters
  </button>
)}

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
    <option value="response_time">Sort by Response Time</option>
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

      {/* Requests List */}
      {!loading && requests.length > 0 && (
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '1rem' })}>
          {requests.map((request) => (
            <div
              key={request.id}
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
                {/* Method Badge */}
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

                {/* Response Code Badge */}
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

                {/* Path */}
                <span className={css({ fontSize: '1.125rem', fontWeight: '500', flex: 1 })}>
                  {request.path}
                </span>
              </div>

              {/* Stats */}
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
      )}
    </div>
  );
}

export default RequestsList;