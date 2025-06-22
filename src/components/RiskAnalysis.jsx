'use client'
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Brain, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner";
import { analysisAPI, useAPI } from '@/lib/api';

const RiskAnalysis = ({ companyId, companyName }) => {
  const [analysisType, setAnalysisType] = useState('general');
  const [riskData, setRiskData] = useState({
    description: '',
    context: '',
    type: 'regulatory'
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const { callAPI, loading, error } = useAPI();

  // Load analyses on component mount
  useEffect(() => {
    if (companyId) {
      loadAnalyses();
    }
  }, [companyId]);

  const loadAnalyses = async () => {
    try {
      const data = await callAPI(analysisAPI.getAllAnalyses, companyId, { limit: 10 });
      setAnalyses(data);
    } catch (err) {
      console.error('Failed to load analyses:', err);
    }
  };

  const runAnalysis = async () => {
    if (!companyId) {
      toast.error('No company selected', 'Please select a company first');
      return;
    }

    try {
      let result;
      
      if (analysisType === 'general') {
        const response = await callAPI(analysisAPI.generalAnalysis, companyId);
        // For general analysis, the result is returned directly
        result = response;
      } else {
        if (!riskData.description.trim()) {
          toast.error('Risk description required', 'Please provide a risk description');
          return;
        }
        const response = await callAPI(analysisAPI.dynamicRiskAnalysis, companyId, riskData);
        // For dynamic risk analysis, extract the "result" field
        result = response.result || response;
      }
      
      setAnalysisResult(result);
      
      // Reload analyses list
      await loadAnalyses();
      
      toast.success('Analysis completed successfully!');
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error('Analysis failed', err.message);
    }
  };

  const getAnalysisById = async (analysisId) => {
    try {
      const data = await callAPI(analysisAPI.getAnalysis, companyId, analysisId);
      setSelectedAnalysis(data);
    } catch (err) {
      console.error('Failed to get analysis:', err);
      toast.error('Failed to get analysis', err.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'operational': 
      case 'operational_risks': 
        return 'text-blue-600 bg-blue-100';
      case 'financial': 
      case 'financial_exposure': 
        return 'text-purple-600 bg-purple-100';
      case 'reputational': 
      case 'reputation_management': 
        return 'text-orange-600 bg-orange-100';
      case 'legal': 
      case 'legal_liabilities': 
        return 'text-red-600 bg-red-100';
      case 'regulatory': 
      case 'regulatory_compliance': 
        return 'text-indigo-600 bg-indigo-100';
      default: 
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Analysis Controls */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Risk Analysis
            {companyName && (
              <Badge variant="outline" className="ml-2">
                {companyName}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Perform general or dynamic risk analysis on company data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Analysis Type Selection */}
            <div className="space-y-2">
              <Label>Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Analysis</SelectItem>
                  <SelectItem value="dynamic_risk">Dynamic Risk Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Risk Inputs */}
            {analysisType === 'dynamic_risk' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="risk-description">Risk Description *</Label>
                  <Input
                    id="risk-description"
                    placeholder="e.g., New GDPR regulations require immediate data processing changes"
                    value={riskData.description}
                    onChange={(e) => setRiskData({...riskData, description: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="risk-context">Risk Context</Label>
                  <Input
                    id="risk-context"
                    placeholder="e.g., EU just announced stricter requirements affecting our customer data handling"
                    value={riskData.context}
                    onChange={(e) => setRiskData({...riskData, context: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Risk Type</Label>
                  <Select value={riskData.type} onValueChange={(value) => setRiskData({...riskData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="reputational">Reputational</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Run Analysis Button */}
            <Button
              onClick={runAnalysis}
              disabled={loading || !companyId}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              {loading ? 'Analyzing...' : `Run ${analysisType === 'general' ? 'General' : 'Dynamic Risk'} Analysis`}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analysis Results
              <Badge variant="secondary" className="ml-2">
                {analysisResult.analysis_id}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Dynamic Risk Analysis - ONLY display the result */}
              {analysisType === 'dynamic_risk' && (
                <div>
                  <h4 className="font-semibold mb-3">Dynamic Risk Analysis Result</h4>
                  <div className="space-y-6">
                    {/* Try to parse and display structured result */}
                    {typeof analysisResult === 'object' && analysisResult.risk_analysis ? (
                      <>
                        {/* Risk Analysis Section */}
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <h5 className="font-semibold mb-3">Risk Analysis</h5>
                          
                          <div className="space-y-4">
                            {/* Scenario */}
                            <div>
                              <h6 className="font-medium mb-1">Scenario</h6>
                              <p className="text-sm text-gray-700">{analysisResult.risk_analysis.scenario}</p>
                            </div>

                            {/* Risk Level */}
                            <div className="flex items-center gap-2">
                              <h6 className="font-medium">Risk Level:</h6>
                              <Badge className={getSeverityColor(analysisResult.risk_analysis.risk_level)}>
                                {analysisResult.risk_analysis.risk_level}
                              </Badge>
                            </div>

                            {/* Impact Assessment */}
                            <div>
                              <h6 className="font-medium mb-1">Impact Assessment</h6>
                              <p className="text-sm text-gray-700">{analysisResult.risk_analysis.impact_assessment}</p>
                            </div>

                            {/* Legal Implications */}
                            {analysisResult.risk_analysis.legal_implications && (
                              <div>
                                <h6 className="font-medium mb-1">Legal Implications</h6>
                                <p className="text-sm text-gray-700">{analysisResult.risk_analysis.legal_implications}</p>
                              </div>
                            )}

                            {/* Regulatory Considerations */}
                            {analysisResult.risk_analysis.regulatory_considerations && (
                              <div>
                                <h6 className="font-medium mb-1">Regulatory Considerations</h6>
                                <p className="text-sm text-gray-700">{analysisResult.risk_analysis.regulatory_considerations}</p>
                              </div>
                            )}

                            {/* Affected Areas */}
                            {analysisResult.risk_analysis.affected_areas && analysisResult.risk_analysis.affected_areas.length > 0 && (
                              <div>
                                <h6 className="font-medium mb-1">Affected Areas</h6>
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                  {analysisResult.risk_analysis.affected_areas.map((area, index) => (
                                    <li key={index}>{area}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* News Triggers */}
                            {analysisResult.risk_analysis.news_triggers && analysisResult.risk_analysis.news_triggers.length > 0 && (
                              <div>
                                <h6 className="font-medium mb-2">News Triggers</h6>
                                <div className="space-y-2">
                                  {analysisResult.risk_analysis.news_triggers.map((trigger, index) => (
                                    <div key={index} className="p-2 bg-white rounded border">
                                      <p className="font-medium text-sm">{trigger.article_title}</p>
                                      <p className="text-xs text-gray-600">{trigger.article_source} - {new Date(trigger.article_date).toLocaleDateString()}</p>
                                      <p className="text-sm text-gray-700 mt-1">{trigger.risk_connection}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Recommendations */}
                        {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                          <div>
                            <h5 className="font-semibold mb-3">Recommendations</h5>
                            <div className="space-y-2">
                              {analysisResult.recommendations.map((rec, index) => (
                                <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                                  <p className="text-sm">{rec}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Next Steps */}
                        {analysisResult.next_steps && analysisResult.next_steps.length > 0 && (
                          <div>
                            <h5 className="font-semibold mb-3">Next Steps</h5>
                            <div className="space-y-2">
                              {analysisResult.next_steps.map((step, index) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                  <p className="text-sm">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI Confidence */}
                        {analysisResult.ai_confidence && (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                              AI Confidence: {(analysisResult.ai_confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      /* Fallback to raw display if not structured */
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        {typeof analysisResult === 'string' ? (
                          <p className="whitespace-pre-wrap text-sm">{analysisResult}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
                            {JSON.stringify(analysisResult, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* General Analysis Results - Only show for general analysis */}
              {analysisType === 'general' && analysisResult.risk_analysis && (
                <div>
                  {/* Overall Risk Assessment */}
                  {analysisResult.overall_risk_assessment && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Overall Risk Assessment</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(analysisResult.overall_risk_assessment.overall_risk_level)}>
                            {analysisResult.overall_risk_assessment.overall_risk_level} Overall Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{analysisResult.overall_risk_assessment.summary}</p>
                        {analysisResult.overall_risk_assessment.critical_issues && (
                          <div>
                            <h5 className="font-medium mb-2">Critical Issues:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {analysisResult.overall_risk_assessment.critical_issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Risk Categories */}
                  <h4 className="font-semibold mb-3">Risk Categories</h4>
                  <div className="space-y-4">
                    {Object.entries(analysisResult.risk_analysis).map(([category, data]) => (
                      <div key={category} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getRiskTypeColor(category)}>
                            {category.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getSeverityColor(data.risk_level)}>
                            {data.risk_level} Risk
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="font-medium mb-2">Assessment</h5>
                          <p className="text-sm text-gray-600">{data.assessment}</p>
                        </div>

                        {data.key_concerns && data.key_concerns.length > 0 && (
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">Key Concerns</h5>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {data.key_concerns.map((concern, index) => (
                                <li key={index}>{concern}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {data.news_triggers && data.news_triggers.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">News Triggers</h5>
                            <div className="space-y-2">
                              {data.news_triggers.map((trigger, index) => (
                                <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                                  <p className="font-medium">{trigger.article_title}</p>
                                  <p className="text-gray-600">{trigger.article_source} - {trigger.article_date}</p>
                                  <p className="text-gray-700 mt-1">{trigger.risk_connection}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Analysis - Recommendations */}
              {analysisType === 'general' && analysisResult.recommendations && (
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Analysis - Next Steps */}
              {analysisType === 'general' && analysisResult.next_steps && (
                <div>
                  <h4 className="font-semibold mb-3">Next Steps</h4>
                  <div className="space-y-2">
                    {analysisResult.next_steps.map((step, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <p className="text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Analysis - AI Confidence */}
              {analysisType === 'general' && analysisResult.ai_confidence && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    AI Confidence: {(analysisResult.ai_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Analyses */}
      {analyses.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Previous Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => getAnalysisById(analysis.id)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {analysis.analysis_type}
                    </Badge>
                    <span className="text-sm font-medium">{analysis.id}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(analysis.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Analysis Details */}
      {selectedAnalysis && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Analysis Details - {selectedAnalysis.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(selectedAnalysis, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskAnalysis; 