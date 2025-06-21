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
        result = await callAPI(analysisAPI.generalAnalysis, companyId);
      } else {
        if (!riskData.description.trim()) {
          toast.error('Risk description required', 'Please provide a risk description');
          return;
        }
        const response = await callAPI(analysisAPI.dynamicRiskAnalysis, companyId, riskData);
        // Extract the "result" field for dynamic risk analysis
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
      case 'operational': return 'text-blue-600 bg-blue-100';
      case 'financial': return 'text-purple-600 bg-purple-100';
      case 'reputational': return 'text-orange-600 bg-orange-100';
      case 'legal': return 'text-red-600 bg-red-100';
      case 'regulatory': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
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
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    {typeof analysisResult === 'string' ? (
                      <p className="whitespace-pre-wrap text-sm">{analysisResult}</p>
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
                        {JSON.stringify(analysisResult, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* General Analysis Results - Only show for general analysis */}
              {analysisType === 'general' && analysisResult.risk_factors && (
                <div>
                  <h4 className="font-semibold mb-3">Risk Factors</h4>
                  <div className="space-y-3">
                    {analysisResult.risk_factors.map((factor, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSeverityColor(factor.severity)}>
                            {factor.severity}
                          </Badge>
                          <Badge className={getRiskTypeColor(factor.risk_type)}>
                            {factor.risk_type}
                          </Badge>
                        </div>
                        <h5 className="font-medium mb-2">{factor.specific_event}</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Affected Contracts:</strong> {factor.affected_contracts}</p>
                          <p><strong>Affected Clauses:</strong> {factor.affected_clauses}</p>
                        </div>
                        {factor.narrative && (
                          <div className="mt-3 space-y-2">
                            <p className="text-sm"><strong>Solutions in Contract:</strong> {factor.narrative.solutions_in_contract}</p>
                            <p className="text-sm"><strong>Alternative Strategies:</strong> {factor.narrative.alternative_mitigation_strategies}</p>
                            <p className="text-sm"><strong>Monitoring Tasks:</strong> {factor.narrative.monitoring_tasks}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Analysis - Other structured results */}
              {analysisType === 'general' && analysisResult.risk_analysis && (
                <div>
                  <h4 className="font-semibold mb-3">Risk Analysis</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium mb-2">Scenario: {analysisResult.risk_analysis.scenario}</p>
                      <Badge className={getSeverityColor(analysisResult.risk_analysis.risk_level)}>
                        {analysisResult.risk_analysis.risk_level} Risk
                      </Badge>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Impact Assessment</h5>
                      <p className="text-sm text-gray-600">{analysisResult.risk_analysis.impact_assessment}</p>
                    </div>

                    {analysisResult.risk_analysis.affected_areas && (
                      <div>
                        <h5 className="font-medium mb-2">Affected Areas</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {analysisResult.risk_analysis.affected_areas.map((area, index) => (
                            <li key={index}>{area}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* General Analysis - News Analysis */}
              {analysisType === 'general' && analysisResult.news_analysis && (
                <div>
                  <h4 className="font-semibold mb-3">News Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{analysisResult.news_analysis.articles_found}</p>
                      <p className="text-sm text-gray-600">Articles Found</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {(analysisResult.news_analysis.negative_sentiment_ratio * 100).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600">Negative Sentiment</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-sm text-gray-600">{analysisResult.news_analysis.market_context}</p>
                    </div>
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