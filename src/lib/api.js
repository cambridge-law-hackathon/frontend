import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  // Remove Content-Type for FormData requests
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Company Management API
export const companyAPI = {
  // Get all companies
  getAll: () => apiCall('/companies'),
  
  // Add new company
  add: (name, context) => apiCall('/companies', {
    method: 'POST',
    body: JSON.stringify({ name, context })
  }),
  
  // Add context to existing company
  addContext: (companyId, context) => apiCall(`/companies/${companyId}/context`, {
    method: 'POST',
    body: JSON.stringify({ context })
  }),
  
  // Get company data
  getById: (companyId) => apiCall(`/companies/${companyId}`)
};

// Document Management API
export const documentAPI = {
  // Upload document
  upload: (companyId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiCall(`/companies/${companyId}/documents`, {
      method: 'POST',
      body: formData
    });
  }
};

// Risk Analysis API
export const analysisAPI = {
  // General company analysis
  generalAnalysis: (companyId) => apiCall(`/companies/${companyId}/analyse`, {
    method: 'POST',
    body: JSON.stringify({})
  }),
  
  // Dynamic risk analysis
  dynamicRiskAnalysis: (companyId, riskData) => apiCall(`/companies/${companyId}/analyse`, {
    method: 'POST',
    body: JSON.stringify({
      risk_description: riskData.description,
      risk_context: riskData.context,
      risk_type: riskData.type
    })
  }),
  
  // Get all analyses for a company
  getAllAnalyses: (companyId, options = {}) => {
    const params = new URLSearchParams();
    if (options.analysisType) params.append('analysis_type', options.analysisType);
    if (options.limit) params.append('limit', options.limit);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/companies/${companyId}/analyses?${queryString}` : `/companies/${companyId}/analyses`;
    
    return apiCall(endpoint);
  },
  
  // Get specific analysis
  getAnalysis: (companyId, analysisId) => apiCall(`/companies/${companyId}/analyses/${analysisId}`)
};

// Custom hook for API calls with loading and error states
export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { callAPI, loading, error, setError };
};

export default apiCall; 