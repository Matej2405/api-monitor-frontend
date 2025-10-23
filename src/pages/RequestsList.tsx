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