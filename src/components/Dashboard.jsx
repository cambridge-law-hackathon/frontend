'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, Brain, BarChart3, Users, Shield } from "lucide-react"
import CompanyManager from './CompanyManager';
import DocumentUpload from './DocumentUpload';
import RiskAnalysis from './RiskAnalysis';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const tabs = [
    {
      id: 'companies',
      label: 'Companies',
      icon: Building2,
      description: 'Manage your companies and view details'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Upload and manage legal documents',
      disabled: !selectedCompany
    },
    {
      id: 'analysis',
      label: 'Risk Analysis',
      icon: Brain,
      description: 'Perform risk analysis on company data',
      disabled: !selectedCompany
    }
  ];

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    // Auto-switch to documents tab when company is selected
    setActiveTab('documents');
  };

  const handleDocumentUploadSuccess = () => {
    // Auto-switch to analysis tab after document upload
    setActiveTab('analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Business Risk Analysis Platform</h1>
          </div>
          <p className="text-gray-600 text-lg">Comprehensive risk management and analysis for your business</p>
        </div>

        {/* Selected Company Display */}
        {selectedCompany && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCompany.name}</h3>
                    <p className="text-blue-100 text-sm">ID: {selectedCompany.id}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Active Company
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur rounded-lg p-1 shadow-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'companies' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Management</h2>
                <p className="text-gray-600">Add companies and view their details. Select a company to proceed with document upload and risk analysis.</p>
              </div>
              <CompanyManager onCompanySelect={handleCompanySelect} />
            </div>
          )}

          {activeTab === 'documents' && selectedCompany && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h2>
                <p className="text-gray-600">Upload PDF or EML files for the selected company. These documents will be used for risk analysis.</p>
              </div>
              <DocumentUpload 
                companyId={selectedCompany.id}
                companyName={selectedCompany.name}
                onUploadSuccess={handleDocumentUploadSuccess}
              />
            </div>
          )}

          {activeTab === 'analysis' && selectedCompany && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Analysis</h2>
                <p className="text-gray-600">Perform comprehensive risk analysis on company data, documents, and external factors.</p>
              </div>
              <RiskAnalysis 
                companyId={selectedCompany.id}
                companyName={selectedCompany.name}
              />
            </div>
          )}

          {/* Empty State for Disabled Tabs */}
          {((activeTab === 'documents' && !selectedCompany) || (activeTab === 'analysis' && !selectedCompany)) && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {activeTab === 'documents' ? (
                      <FileText className="h-8 w-8 text-gray-400" />
                    ) : (
                      <Brain className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeTab === 'documents' ? 'No Company Selected' : 'No Company Selected'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'documents' 
                      ? 'Please select a company first to upload documents.'
                      : 'Please select a company first to perform risk analysis.'
                    }
                  </p>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    Go to Companies
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        {selectedCompany && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Company Active</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Documents Ready</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Analysis Available</p>
                </div>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center">
                  <Shield className="h-6 w-6 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Risk Protected</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 