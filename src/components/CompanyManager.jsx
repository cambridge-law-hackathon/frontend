'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, X, Briefcase, AlertCircle, Eye } from "lucide-react"
import { toast } from "sonner";
import { companyAPI, useAPI } from '@/lib/api';

const CompanyManager = ({ onCompanySelect }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyInput, setCompanyInput] = useState("");
  const [companyContext, setCompanyContext] = useState("");
  const { callAPI, loading, error } = useAPI();

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await callAPI(companyAPI.getAll);
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      toast.error('Failed to load companies', err.message);
    }
  };

  const addCompany = async () => {
    if (companyInput.trim() === "") {
      toast.error("Invalid input", "Please enter a company name");
      return;
    }

    if (companies.some(c => c.name === companyInput.trim())) {
      toast.error("Company already exists", "This company is already in your list");
      return;
    }

    try {
      const result = await callAPI(companyAPI.add, companyInput.trim(), companyContext);
      
      // Reload companies to get the updated list
      await loadCompanies();
      
      setCompanyInput("");
      setCompanyContext("");
      toast.success(`Company added: ${companyInput.trim()} has been added to your list`);
    } catch (err) {
      console.error('Failed to add company:', err);
      toast.error('Failed to add company', err.message);
    }
  };

  const addCompanyContext = async (companyId, context) => {
    if (!context.trim()) {
      toast.error("Invalid input", "Please enter context");
      return;
    }

    try {
      await callAPI(companyAPI.addContext, companyId, context);
      await loadCompanies(); // Reload to get updated data
      toast.success("Context added successfully");
    } catch (err) {
      console.error('Failed to add context:', err);
      toast.error('Failed to add context', err.message);
    }
  };

  const getCompanyData = async (companyId) => {
    try {
      const data = await callAPI(companyAPI.getById, companyId);
      setSelectedCompany(data);
      return data;
    } catch (err) {
      console.error('Failed to get company data:', err);
      toast.error('Failed to get company data', err.message);
    }
  };

  const handleCompanySelect = async (company) => {
    try {
      const fullCompanyData = await getCompanyData(company.id);
      if (fullCompanyData && onCompanySelect) {
        onCompanySelect(fullCompanyData);
      }
    } catch (err) {
      console.error('Failed to select company:', err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Company Form */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Company
          </CardTitle>
          <CardDescription>Enter the name and context of a company you'd like to track</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="company-input">Company Name</Label>
                <Input
                  id="company-input"
                  placeholder="e.g., Acme Corp, Globex Inc..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={addCompany} 
                  className="px-8 py-2 h-10" 
                  disabled={!companyInput.trim() || loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? 'Adding...' : 'Add Company'}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-context">Company Context (Optional)</Label>
              <Input
                id="company-context"
                placeholder="e.g., Acme is a global widget supplier with operations in 15 countries..."
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="shadow-lg border-0 bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Companies List */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Your Companies
            <Badge variant="secondary" className="ml-2">
              {companies.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            {companies.length === 0
              ? "No companies added yet. Start by adding your first company above!"
              : `You're tracking ${companies.length} ${companies.length === 1 ? "company" : "companies"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && companies.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading companies...</p>
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No companies yet</p>
              <p className="text-gray-400">Add your first company to get started</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium truncate">{company.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => getCompanyData(company.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 hover:bg-white/20 text-white"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompanySelect(company)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 hover:bg-white/20 text-white"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Company Details */}
      {selectedCompany && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedCompany.name} - Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Company ID:</Label>
                <p className="text-sm text-gray-600">{selectedCompany.id}</p>
              </div>
              
              <div>
                <Label className="font-medium">Context:</Label>
                {selectedCompany.context && selectedCompany.context.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {selectedCompany.context.map((ctx, index) => (
                      <li key={index}>{ctx}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No context available</p>
                )}
              </div>
              
              <div>
                <Label className="font-medium">Documents:</Label>
                {selectedCompany.documents && selectedCompany.documents.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {selectedCompany.documents.map((doc, index) => (
                      <li key={index}>
                        {doc.file_name} ({doc.file_type}) - {new Date(doc.uploaded_at).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No documents uploaded</p>
                )}
              </div>
              
              <div>
                <Label className="font-medium">Created:</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedCompany.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompanyManager; 