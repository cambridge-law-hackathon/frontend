'use client'
import Image from "next/image";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, X, Briefcase } from "lucide-react"
import { toast } from "sonner";
import RiskTable from "@/components/table-component";

export default function Home() {


  const [companies, setCompanies] = useState([]);
  const [companyInput, setCompanyInput] = useState("");
   const [companyDescription, setCompanyDescription] = useState("");
   const [ pdfToExtract, setPdfToExtract ] = useState(null)

   const riskData = {
  risk_factors: [
    {
      severity: "High",
      specific_event: "Iran tensions escalation",
      risk_type: "Operational Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Article 10 – Regulatory Suspension Clause, Article 17 – Force Majeure Clause",
      narrative: {
        solutions_in_contract: "Regulatory suspension and force majeure clauses provide protection against unforeseen events",
        alternative_mitigation_strategies: "Diversification of energy sources and supplier contracts, investment in conflict resolution and prevention",
        monitoring_tasks: "Continuous monitoring of global events and tensions, regular review of contractual obligations and supplier relationships"
      }
    },
    {
      severity: "Medium",
      specific_event: "Global oil market volatility",
      risk_type: "Financial Risk",
      affected_contracts: "Contract draft between Gasil Global and EuroPOWER",
      affected_clauses: "Article 7 – Compliance with Law and Sanctions, Article 18 – Termination Of Obligations Under This Contract",
      narrative: {
        solutions_in_contract: "Contractual clauses provide protection against non-compliance and termination",
        alternative_mitigation_strategies: "Hedging strategies, diversification of energy sources and supplier contracts",
        monitoring_tasks: "Regular review of oil market trends, monitoring of supplier relationships and contractual obligations"
      }
    },
    {
      severity: "Medium",
      specific_event: "Negative news coverage",
      risk_type: "Reputational Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Article 7 – Compliance with Law and Sanctions",
      narrative: {
        solutions_in_contract: "Contractual clauses provide protection against non-compliance",
        alternative_mitigation_strategies: "Crisis management and communication plans, investment in reputation management and public relations",
        monitoring_tasks: "Continuous monitoring of news coverage and social media, regular review of contractual obligations and supplier relationships"
      }
    },
    {
      severity: "Low",
      specific_event: "Regulatory changes",
      risk_type: "Legal Risk",
      affected_contracts: "Contract draft between Gasil Global and EuroPOWER",
      affected_clauses: "Article 10 – Regulatory Suspension Clause",
      narrative: {
        solutions_in_contract: "Regulatory suspension clause provides protection against unforeseen regulatory changes",
        alternative_mitigation_strategies: "Regular review of regulatory changes, investment in compliance and risk management",
        monitoring_tasks: "Continuous monitoring of regulatory updates, regular review of contractual obligations and supplier relationships"
      }
    },
    {
      severity: "High",
      specific_event: "Non-compliance with sanctions",
      risk_type: "Legal Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Article 7 – Compliance with Law and Sanctions",
      narrative: {
        solutions_in_contract: "Contractual clauses provide protection against non-compliance",
        alternative_mitigation_strategies: "Investment in compliance and risk management, regular review of supplier relationships and contractual obligations",
        monitoring_tasks: "Continuous monitoring of sanctions updates, regular review of contractual obligations and supplier relationships"
      }
    }
  ]
};
  

  function addCompany() {
    if (companyInput.trim() === "") {
      toast.error("Invalid input","Please enter a company name")
      return
    }

    if (companies.includes(companyInput.trim())) {
      toast.error("Company already exists","This company is already in your list")
      return
    }

    setCompanies((prev) => [...prev, { name: companyInput.trim(), description: companyDescription }])//will need to replace this with backend api call to add company
    setCompanyInput("")
    setCompanyDescription("")
    toast.success(`Company added: ${companyInput.trim()} has been added to your list`)
  }

  function removeCompany(companyToRemove) {
    setCompanies((prev) => prev.filter((company) => company !== companyToRemove))
    toast.success(`Company removed: ${companyToRemove} has been removed from your list`)
  }


  useEffect(() => {
    console.log("companies are: ", companies)

    //add in api request to backend, to fetch companies and update companies list on every render


  }, [companies])

  async function addDocuments() {
    console.log("need to add documents here!")

     const formData = new FormData()
    formData.append('file', pdfToExtract);

    const response = await fetch('http://127.0.0.1:5001/api/companies/{company_id}/documents', {
      method: 'POST',
      body: formData,
    });

    let data = response.json()
    console.log("all okay")

    toast.success(`Document successfully uploaded!`)


    //add backend api, to add - use companyId
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Company Manager</h1>
          </div>
          <p className="text-gray-600 text-lg">Keep track of companies you're interested in</p>
        </div>

        {/* Add Company Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Company
            </CardTitle>
            <CardDescription>Enter the name of a company you'd like to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="company-input">Company Name</Label>
                <Input
                  id="company-input"
                  placeholder="e.g., Google, Microsoft, Apple..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="company-input">Company description</Label>
                <Input
                  id="company-input"
                  placeholder="e.g., Google, Microsoft, Apple..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addCompany} className="px-8 py-2 h-10" disabled={!companyInput.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Your Company
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
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No company yet</p>
                <p className="text-gray-400">Add your first company to get started</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {companies.map((company, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium truncate">{company.name}</span>
                        <span className="font-medium truncate">{company.description}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompany(company)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/20 text-white"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <label>add documents</label>
                      <input type='file' accept='.pdf' onChange={(e) => setPdfToExtract(e.target.files[0])} />
                      <Button
                        size="sm"
                        onClick={addDocuments}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-white/20 text-white"
                      >
                        <span>{`add ${company.name} documents`}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{companies.length}</div>
                <p className="text-sm text-gray-600">Total Companies</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{Math.max(...companies.map((c) => c.name.length))}</div>
                <p className="text-sm text-gray-600">Longest Name</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(companies.reduce((acc, c) => acc + c.name.length, 0) / companies.length)}
                </div>
                <p className="text-sm text-gray-600">Avg Name Length</p>
              </CardContent>
            </Card>
          </div>
        )}
        <RiskTable riskData={riskData} />
      </div>
    </div>
  )
}

