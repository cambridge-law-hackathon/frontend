"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Eye, FileText, Zap, CheckCircle2 } from "lucide-react"

const getSeverityColor = (severity) => {
  switch (severity.toLowerCase()) {
    case "high":
    case "critical":
      return "bg-red-500"
    case "medium":
    case "moderate":
      return "bg-yellow-500"
    case "low":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

const getSeverityIcon = (severity) => {
  switch (severity.toLowerCase()) {
    case "high":
    case "critical":
      return <AlertTriangle className="h-4 w-4" />
    case "medium":
    case "moderate":
      return <Shield className="h-4 w-4" />
    case "low":
      return <CheckCircle2 className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const RiskTable = ({ riskData }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Risk Assessment Overview
            <Badge variant="secondary" className="ml-2">
              {riskData.risk_factors.length} Risks
            </Badge>
          </CardTitle>
          <CardDescription>Comprehensive analysis of identified risks and mitigation strategies</CardDescription>
        </CardHeader>
      </Card>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <th className="text-left p-4 font-semibold text-gray-700">Severity</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Event</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Contracts</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Clauses</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Solutions</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Mitigation</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Monitoring</th>
                </tr>
              </thead>
              <tbody>
                {riskData.risk_factors.map((risk, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50/50 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full text-white ${getSeverityColor(risk.severity)}`}>
                          {getSeverityIcon(risk.severity)}
                        </div>
                        <span className="font-medium">{risk.severity}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.specific_event}>
                        {risk.specific_event}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{risk.risk_type}</Badge>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.affected_contracts}>
                        {risk.affected_contracts}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.affected_clauses}>
                        {risk.affected_clauses}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.narrative.solutions_in_contract}>
                        {risk.narrative.solutions_in_contract}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.narrative.alternative_mitigation_strategies}>
                        {risk.narrative.alternative_mitigation_strategies}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="truncate" title={risk.narrative.monitoring_tasks}>
                        {risk.narrative.monitoring_tasks}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {riskData.risk_factors.map((risk, index) => (
          <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full text-white ${getSeverityColor(risk.severity)}`}>
                    {getSeverityIcon(risk.severity)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{risk.severity} Risk</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {risk.risk_type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Specific Event
                </h4>
                <p className="text-gray-600 text-sm">{risk.specific_event}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Affected Contracts
                  </h4>
                  <p className="text-gray-600 text-sm">{risk.affected_contracts}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-1">Affected Clauses</h4>
                  <p className="text-gray-600 text-sm">{risk.affected_clauses}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Solutions in Contract
                </h4>
                <p className="text-gray-600 text-sm">{risk.narrative.solutions_in_contract}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  Alternative Mitigation
                </h4>
                <p className="text-gray-600 text-sm">{risk.narrative.alternative_mitigation_strategies}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Monitoring Tasks
                </h4>
                <p className="text-gray-600 text-sm">{risk.narrative.monitoring_tasks}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      {riskData.risk_factors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {
                  riskData.risk_factors.filter(
                    (r) => r.severity.toLowerCase() === "high" || r.severity.toLowerCase() === "critical",
                  ).length
                }
              </div>
              <p className="text-sm text-gray-600">High/Critical</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  riskData.risk_factors.filter(
                    (r) => r.severity.toLowerCase() === "medium" || r.severity.toLowerCase() === "moderate",
                  ).length
                }
              </div>
              <p className="text-sm text-gray-600">Medium</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {riskData.risk_factors.filter((r) => r.severity.toLowerCase() === "low").length}
              </div>
              <p className="text-sm text-gray-600">Low Risk</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{riskData.risk_factors.length}</div>
              <p className="text-sm text-gray-600">Total Risks</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default RiskTable