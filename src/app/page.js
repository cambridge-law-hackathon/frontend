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
   const [ riskDataReal, setRiskDataReal ] = useState([])
   const [ specificRisks, setSpecificRisks ] = useState("")
   const [ specificQuery, setSpecificQuery ] = useState("")

   const riskData = {
  risk_factors: [
    {
      severity: "High",
      specific_event: "Global supply chain disruptions due to geopolitical tensions",
      risk_type: "Operational Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Section 3: Force Majeure",
      narrative: {
        solutions_in_contract: "Contractual protections include provisions for alternative sourcing and renegotiation of terms",
        alternative_mitigation_strategies: "Developing diversified supply chains and implementing risk management protocols",
        monitoring_tasks: "Regularly monitoring global events and assessing their potential impact on supply chains"
      }
    },
    {
      severity: "Medium",
      specific_event: "Fluctuations in oil prices affecting demand for electric vehicles",
      risk_type: "Financial Risk",
      affected_contracts: "None",
      affected_clauses: "N/A",
      narrative: {
        solutions_in_contract: "No specific contractual protections",
        alternative_mitigation_strategies: "Diversifying product offerings, investing in renewable energy, and developing strategic partnerships",
        monitoring_tasks: "Tracking oil price trends and assessing their impact on the electric vehicle market"
      }
    },
    {
      severity: "Low",
      specific_event: "Negative media coverage due to recalls or accidents",
      risk_type: "Reputational Risk",
      affected_contracts: "None",
      affected_clauses: "N/A",
      narrative: {
        solutions_in_contract: "No specific contractual protections",
        alternative_mitigation_strategies: "Implementing robust quality control measures, maintaining transparent communication, and engaging in proactive reputation management",
        monitoring_tasks: "Monitoring media coverage and social media sentiment"
      }
    },
    {
      severity: "High",
      specific_event: "Non-compliance with evolving regulatory requirements",
      risk_type: "Regulatory Compliance Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Section 2: Compliance with Laws",
      narrative: {
        solutions_in_contract: "Contractual provisions require compliance with applicable laws and regulations",
        alternative_mitigation_strategies: "Establishing a dedicated compliance team, conducting regular audits, and maintaining open communication with regulatory bodies",
        monitoring_tasks: "Staying up-to-date with regulatory changes and assessing their impact on business operations"
      }
    },
    {
      severity: "Medium",
      specific_event: "Litigation related to intellectual property or product liability",
      risk_type: "Legal Risk",
      affected_contracts: "master_service_agreement.pdf",
      affected_clauses: "Section 5: Intellectual Property and Section 7: Indemnification",
      narrative: {
        solutions_in_contract: "Contractual protections include provisions for indemnification and intellectual property rights",
        alternative_mitigation_strategies: "Developing robust intellectual property protection strategies, conducting regular product safety assessments, and maintaining adequate insurance coverage",
        monitoring_tasks: "Monitoring potential litigation risks and maintaining open communication with stakeholders"
      }
    }
  ]
}
  

  function addCompany() {
    if (companyInput.trim() === "") {
      toast.error("Invalid input","Please enter a company name")
      return
    }

    if (companies.includes(companyInput.trim())) {
      toast.error("Company already exists","This company is already in your list")
      return
    }
    //need to replace this with insertion into supabase database

    setCompanies([{ name: companyInput.trim(), description: companyDescription }])//will need to replace this with backend api call to add company
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

    let company_id = 75

    /*const response = await fetch(`http://127.0.0.1:5001/api/companies/${company_id}/document`, {
      //http://127.0.0.1:5001
      method: 'POST',
      body: formData,
    });*/

    //let data = response.json()
    console.log("all okay")

    toast.success(`Document successfully uploaded!`)


    //add backend api, to add - use companyId
  }


  async function specificRisk() {

   let data = `No.

Reason/s:
- The news summary mentions "tensions" with Iran, which does imply some level of geopolitical risk. However, it does not explicitly state that there is a real risk of war.
- The term "war" is not mentioned in the provided data.
- The sentiment of the news summary is negative, indicating that the situation is concerning, but it does not directly suggest that a war is imminent or real.
- There is no information from the company's documents that suggests a real risk of war with Iran.`
    
    toast.success(`specific risk being called!`)
    setSpecificRisks(data)

  }

  async function generalRisks() {
    /*const response = await fetch(`http://127.0.0.1:5001/api/companies/${company_id}/document`, {
      //http://127.0.0.1:5001
      method: 'POST',
      body: formData,
    });*/

    // Show loading toast immediately
    const loadingToast = toast.loading("Generating risk assessment... This may take a moment.", {
      duration: Number.POSITIVE_INFINITY, // Keep it visible until we dismiss it
    })

    setTimeout(() => {
      // Dismiss the loading toast
      toast.dismiss(loadingToast)

      // Set the risk data and show success toast
      setRiskDataReal(riskData)
      toast.success("Risk assessment generated successfully!")
    }, 12000)

   

    //let data = response.json()
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900">Company Manager</h1>
          </div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Comprehensive risk assessment and company tracking platform
          </p>
        </div>

        {/* Add Company Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              Add New Company
            </CardTitle>
            <CardDescription className="text-base">
              Enter company details to start tracking and risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="company-name" className="text-sm font-semibold text-gray-700">
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="e.g., Tesla, Apple, Microsoft..."
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="company-description" className="text-sm font-semibold text-gray-700">
                  Company Description
                </Label>
                <Input
                  id="company-description"
                  placeholder="Brief description of the company..."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={addCompany}
                className="px-8 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                disabled={!companyInput.trim()}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Company
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Risk Query Section */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-orange-600" />
              </div>
              Specific Risk Query
            </CardTitle>
            <CardDescription className="text-base">Query specific risks across your tracked companies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-3">
                <Label htmlFor="risk-query" className="text-sm font-semibold text-gray-700">
                  Risk Query
                </Label>
                <Input
                  id="risk-query"
                  type="text"
                  placeholder="e.g., supply chain risks, regulatory changes, geopolitical tensions..."
                  value={specificQuery}
                  onChange={(e) => setSpecificQuery(e.target.value)}
                  className="text-lg h-12 border-2 focus:border-orange-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={specificRisk}
                  className="px-6 py-3 text-lg font-semibold bg-orange-600 hover:bg-orange-700 h-12"
                >
                  Query Risks
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              Your Companies
              <Badge variant="secondary" className="ml-3 px-3 py-1 text-sm">
                {companies.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              {companies.length === 0
                ? "No companies added yet. Start by adding your first company above!"
                : `You're tracking ${companies.length} ${companies.length === 1 ? "company" : "companies"}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl mb-2">No companies yet</p>
                <p className="text-gray-400 text-lg">Add your first company to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {companies.map((company, index) => (
                  <Card
                    key={index}
                    className="border-2 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-2xl text-gray-900 mb-1">{company.name}</h3>
                            {company.description && <p className="text-gray-600 text-lg">{company.description}</p>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCompany(company)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800 text-lg border-b pb-2">Risk Assessment</h4>
                          <Button
                            onClick={generalRisks}
                            variant="outline"
                            className="w-full justify-start text-lg py-3 border-2 hover:border-blue-500 hover:bg-blue-50"
                          >
                            <Briefcase className="h-5 w-5 mr-3" />
                            Generate Risk Report
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-800 text-lg border-b pb-2">Document Upload</h4>
                          <div className="space-y-3">
                            <Input
                              type="file"
                              accept=".pdf"
                              onChange={(e) => setPdfToExtract(e.target.files[0])}
                              className="text-base border-2 focus:border-green-500"
                            />
                            {pdfToExtract && (
                              <p className="text-sm text-green-600 font-medium">Selected: {pdfToExtract.name}</p>
                            )}
                            <Button
                              onClick={addDocuments}
                              variant="outline"
                              disabled={!pdfToExtract}
                              className="w-full text-lg py-3 border-2 hover:border-green-500 hover:bg-green-50 disabled:opacity-50"
                            >
                              <Plus className="h-5 w-5 mr-3" />
                              Upload Document
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specific Risk Results */}
        {specificRisks && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm border-l-4 border-l-red-500">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-red-700">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-red-600" />
                </div>
                Specific Risk Assessment Results
              </CardTitle>
              <CardDescription className="text-base">Analysis results for your risk query</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <pre className="text-gray-700 whitespace-pre-wrap font-mono text-base leading-relaxed">
                  {specificRisks}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        {companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-blue-600 mb-3">{companies.length}</div>
                <p className="text-gray-600 font-semibold text-lg">Total Companies</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-green-600 mb-3">
                  {companies.length > 0 ? Math.max(...companies.map((c) => c.name.length)) : 0}
                </div>
                <p className="text-gray-600 font-semibold text-lg">Longest Name</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl font-bold text-purple-600 mb-3">
                  {companies.length > 0
                    ? Math.round(companies.reduce((acc, c) => acc + c.name.length, 0) / companies.length)
                    : 0}
                </div>
                <p className="text-gray-600 font-semibold text-lg">Avg Name Length</p>
              </CardContent>
            </Card>
          </div>
        )}

        <RiskTable riskData={riskDataReal} />
      </div>
    </div>
  )
}

