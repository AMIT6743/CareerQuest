import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CheckCircle, Clock, TrendingUp, Award, Zap, Lightbulb, ArrowRight, BookOpen, Users, Briefcase, Star, BarChart2, Target, Activity, AlertTriangle, CheckCircle2, Download, DollarSign, Rocket, Building2, FileText, TrendingDown, ThumbsUp, ThumbsDown, PieChart, Coins, MapPin, Calendar, UserCheck, GraduationCap, BarChart as BarChartIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';

// Define interfaces for scenario results
interface PersonalityTrait {
  trait: string;
  score: number;
  description: string;
  careerImplications: string;
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  importance: number;
}

interface LearningPathItem {
  skill: string;
  resources: string[];
  action: string;
  timeline: string;
  measurableOutcome: string;
  difficultyLevel?: string;
}

interface JobOpportunity {
  title: string;
  companyType: string;
  salaryRange: string;
  experienceLevel: string;
  location: string;
  keySkills: string[];
  growthPotential: string;
  description?: string;
}

interface StartupGuide {
  sector: string;
  howToStart: {
    steps: Array<{ step: string; description: string; timeline: string }>;
    initialInvestment: string;
    keyRequirements: string[];
  };
  businessPlanning: {
    businessModel: string;
    revenueStreams: string[];
    targetCustomers: string;
    competitiveAnalysis: string;
    marketingStrategy: string;
  };
  finance: {
    startupCosts: string;
    fundingOptions: Array<{ type: string; description: string; pros: string[]; cons: string[] }>;
    revenueProjections: string;
    breakEvenAnalysis: string;
    financialMilestones: Array<{ milestone: string; timeline: string; target: string }>;
  };
}

interface ProsAndCons {
  pros: Array<{ point: string; description: string }>;
  cons: Array<{ point: string; description: string }>;
  overallAssessment: string;
}

interface ScenarioAnalysis {
  personalityProfile?: PersonalityTrait[];
  skillGaps?: SkillGap[];
  learningPath?: LearningPathItem[];
  jobOpportunities?: JobOpportunity[];
  startupGuide?: StartupGuide;
  prosAndCons?: ProsAndCons;
  fieldOfInterest?: string;
  niche?: string;
}

interface ScenarioResultsDisplayProps {
  analysis: ScenarioAnalysis;
  userName: string;
  onRestart: () => void;
}

// Theme colors matching the UI palette
const PRIMARY_COLOR = "hsl(238, 82%, 65%)";
const SECONDARY_COLOR = "hsl(25, 96%, 55%)";
const PRIMARY_RGB = "99, 102, 241"; // approximate rgb for recharts
const SECONDARY_RGB = "251, 146, 60";

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ScenarioResultsDisplay = ({ analysis, userName, onRestart }: ScenarioResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState("personality");

  // Prepare data for skill gaps chart - ensure levels are 0-5
  const skillGapsData = analysis.skillGaps?.map(gap => ({
    skill: gap.skill.length > 20 ? gap.skill.substring(0, 20) + '...' : gap.skill,
    fullSkill: gap.skill,
    current: Math.max(0, Math.min(5, gap.currentLevel)), // Ensure 0-5 range
    target: Math.max(0, Math.min(5, gap.targetLevel)), // Ensure 0-5 range
    gap: Math.max(0, Math.min(5, gap.targetLevel - gap.currentLevel)), // Ensure valid gap
    importance: gap.importance
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {userName}'s Scenario Analysis Results
        </h1>
        <p className="text-muted-foreground">
          Complete insights based on your scenario responses
        </p>
        {(analysis.fieldOfInterest || analysis.niche) && (
          <div className="mt-4 flex gap-2">
            {analysis.fieldOfInterest && (
              <Badge variant="secondary" className="text-sm">
                {analysis.fieldOfInterest}
              </Badge>
            )}
            {analysis.niche && (
              <Badge variant="outline" className="text-sm">
                {analysis.niche}
              </Badge>
            )}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-1 bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="personality" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Personality</span>
          </TabsTrigger>
          <TabsTrigger value="skill-gaps" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Skill Gaps</span>
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Learning Path</span>
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Jobs & Salaries</span>
          </TabsTrigger>
          <TabsTrigger value="startups" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Rocket className="w-4 h-4" />
            <span className="hidden sm:inline">Startups</span>
          </TabsTrigger>
          <TabsTrigger value="pros-cons" className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <BarChartIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Pros & Cons</span>
          </TabsTrigger>
        </TabsList>

        {/* Personality Profile Tab */}
        <TabsContent value="personality" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserCheck className="w-5 h-5 text-primary" />
                Personality Profile
              </CardTitle>
              <CardDescription>
                Your personality traits based on your scenario responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.personalityProfile && analysis.personalityProfile.length > 0 ? (
                <div className="space-y-4">
                    {analysis.personalityProfile.map((trait, index) => {
                      const scoreColor = trait.score >= 80 ? 'text-primary' : 
                                        trait.score >= 60 ? 'text-secondary' : 
                                        'text-muted-foreground';
                      return (
                        <Card key={index} className="p-5 hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-r from-card to-card/50">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-lg">{trait.trait}</h4>
                              <Badge variant="secondary" className={cn("text-sm font-semibold", scoreColor)}>
                                {trait.score}/100
                              </Badge>
                            </div>
                            <Progress value={trait.score} className="h-2.5" />
                            <p className="text-sm text-muted-foreground">{trait.description}</p>
                            <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                              <Lightbulb className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Career Implications:</p>
                                <p className="text-sm text-muted-foreground">{trait.careerImplications}</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No personality profile data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Gaps Tab */}
        <TabsContent value="skill-gaps" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-primary" />
                Skill Gap Analysis
              </CardTitle>
              <CardDescription>
                Identify skills you need to develop to reach your career goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.skillGaps && analysis.skillGaps.length > 0 ? (
                <>
                  {/* Bar Chart */}
                  {skillGapsData.length > 0 && (
                    <div className="w-full bg-card/30 rounded-lg p-6 border border-border/50">
                      <h3 className="text-lg font-semibold mb-4">Skill Levels Comparison</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={skillGapsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis 
                            dataKey="skill" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                          />
                          <YAxis 
                            domain={[0, 5]}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                            label={{ value: 'Skill Level', angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--foreground))' } }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar 
                            dataKey="current" 
                            name="Current Level"
                            fill={`rgb(${SECONDARY_RGB})`}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar 
                            dataKey="target" 
                            name="Target Level"
                            fill={PRIMARY_COLOR}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Skill Gap Cards */}
                  <div className="space-y-4">
                    {analysis.skillGaps
                      .sort((a, b) => b.importance - a.importance)
                      .map((gap, index) => {
                        const gapSize = Math.max(0, gap.targetLevel - gap.currentLevel);
                        const progressPercentage = (gap.currentLevel / gap.targetLevel) * 100;
                        return (
                          <Card key={index} className="p-5 hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-r from-card to-card/50">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-lg mb-1">{gap.skill}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Current: {gap.currentLevel}/5</span>
                                    <ArrowRight className="w-4 h-4" />
                                    <span>Target: {gap.targetLevel}/5</span>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    gap.importance >= 4
                                      ? "destructive"
                                      : gap.importance >= 3
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  Priority: {gap.importance.toFixed(1)}/5
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Current Level ({gap.currentLevel}/5)</span>
                                  <span>Target Level ({gap.targetLevel}/5)</span>
                                </div>
                                <div className="relative h-4 bg-muted/50 rounded-full overflow-hidden">
                                  <div
                                    className="absolute h-full transition-all duration-500 rounded-full"
                                    style={{ 
                                      width: `${(gap.currentLevel / 5) * 100}%`,
                                      background: `linear-gradient(90deg, hsl(${SECONDARY_RGB}) 0%, hsl(25, 96%, 45%) 100%)`
                                    }}
                                  />
                                  <div
                                    className="absolute h-full opacity-30 transition-all duration-500 rounded-full border-2 border-primary/50"
                                    style={{ 
                                      width: `${(gap.targetLevel / 5) * 100}%`,
                                      background: `linear-gradient(90deg, transparent 0%, hsl(${PRIMARY_RGB}, 0.2) 100%)`
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <AlertTriangle className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-sm">
                                  Gap: {gapSize.toFixed(1)} levels to close ({progressPercentage.toFixed(0)}% complete)
                                </span>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No skill gap data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommended Learning Path Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GraduationCap className="w-5 h-5 text-primary" />
                Recommended Learning Path
              </CardTitle>
              <CardDescription>
                Step-by-step learning journey to bridge your skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.learningPath && analysis.learningPath.length > 0 ? (
                <div className="space-y-6">
                  {analysis.learningPath.map((item, index) => (
                    <Card key={index} className="p-5 relative hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-r from-card to-card/50">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                          <span className="text-primary font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">{item.skill}</h4>
                            <p className="text-sm text-muted-foreground">{item.action}</p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                              <Clock className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Timeline</p>
                                <p className="text-sm text-muted-foreground">{item.timeline}</p>
                              </div>
                            </div>
                            {item.difficultyLevel && (
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                                <Zap className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium">Difficulty</p>
                                  <p className="text-sm text-muted-foreground">{item.difficultyLevel}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {item.resources && item.resources.length > 0 && (
                            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                Resources
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
                                {item.resources.map((resource, resIndex) => (
                                  <li key={resIndex}>{resource}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.measurableOutcome && (
                            <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                              <CheckCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Expected Outcome</p>
                                <p className="text-sm text-muted-foreground">{item.measurableOutcome}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < analysis.learningPath!.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-primary/20 via-primary/40 to-transparent" style={{ height: 'calc(100% + 1.5rem)' }} />
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No learning path data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Opportunities & Salaries Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Opportunities & Expected Salaries
              </CardTitle>
              <CardDescription>
                Explore career opportunities and compensation in your field
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.jobOpportunities && analysis.jobOpportunities.length > 0 ? (
                <div className="space-y-4">
                  {analysis.jobOpportunities.map((job, index) => (
                    <Card key={index} className="p-5 hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-r from-card to-card/50 group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-xl group-hover:text-primary transition-colors">{job.title}</h4>
                              <Badge variant="outline" className="border-primary/20">{job.companyType}</Badge>
                            </div>
                            {job.description && (
                              <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              <DollarSign className="w-5 h-5 text-primary" />
                              <span>{job.salaryRange}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{job.experienceLevel}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-border/50">
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5">
                            <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{job.location}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-secondary/5">
                            <TrendingUp className="w-4 h-4 mt-1 text-secondary flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Growth Potential</p>
                              <p className="text-sm text-muted-foreground">{job.growthPotential}</p>
                            </div>
                          </div>
                        </div>

                        {job.keySkills && job.keySkills.length > 0 && (
                          <div className="pt-3 border-t border-border/50">
                            <p className="text-sm font-medium mb-2">Key Skills Required</p>
                            <div className="flex flex-wrap gap-2">
                              {job.keySkills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No job opportunities data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Startups Tab */}
        <TabsContent value="startups" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Rocket className="w-5 h-5 text-primary" />
                Startup Guide
              </CardTitle>
              <CardDescription>
                How to start, plan, and finance your startup in this sector
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {analysis.startupGuide ? (
                <>
                  {/* How to Start Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <Rocket className="w-5 h-5 text-primary" />
                      How to Start in {analysis.startupGuide.sector}
                    </h3>
                    <Card className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-card border-primary/20">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-medium">Initial Investment: {analysis.startupGuide.howToStart.initialInvestment}</span>
                        </div>
                        {analysis.startupGuide.howToStart.keyRequirements && (
                          <div>
                            <p className="text-sm font-medium mb-2">Key Requirements:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
                              {analysis.startupGuide.howToStart.keyRequirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {analysis.startupGuide.howToStart.steps && (
                        <div className="space-y-3 pt-4 border-t border-primary/20">
                          {analysis.startupGuide.howToStart.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                                <span className="text-primary font-bold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex-1 space-y-1">
                                <h4 className="font-medium">{step.step}</h4>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  <span>{step.timeline}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Business Planning Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <FileText className="w-5 h-5 text-primary" />
                      Business Planning
                    </h3>
                    <Card className="p-5 border-border/50 bg-gradient-to-r from-card to-card/50">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <h4 className="font-medium mb-2">Business Model</h4>
                          <p className="text-sm text-muted-foreground">{analysis.startupGuide.businessPlanning.businessModel}</p>
                        </div>
                        {analysis.startupGuide.businessPlanning.revenueStreams && (
                          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                            <h4 className="font-medium mb-2">Revenue Streams</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {analysis.startupGuide.businessPlanning.revenueStreams.map((stream, idx) => (
                                <li key={idx}>{stream}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                            <h4 className="font-medium mb-2">Target Customers</h4>
                            <p className="text-sm text-muted-foreground">{analysis.startupGuide.businessPlanning.targetCustomers}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                            <h4 className="font-medium mb-2">Competitive Analysis</h4>
                            <p className="text-sm text-muted-foreground">{analysis.startupGuide.businessPlanning.competitiveAnalysis}</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <h4 className="font-medium mb-2">Marketing Strategy</h4>
                          <p className="text-sm text-muted-foreground">{analysis.startupGuide.businessPlanning.marketingStrategy}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Finance Section */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      <Coins className="w-5 h-5 text-primary" />
                      Financial Planning
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="p-4 border-border/50 bg-gradient-to-br from-primary/5 to-card">
                        <h4 className="font-medium mb-2">Startup Costs</h4>
                        <p className="text-sm text-muted-foreground">{analysis.startupGuide.finance.startupCosts}</p>
                      </Card>
                      <Card className="p-4 border-border/50 bg-gradient-to-br from-secondary/5 to-card">
                        <h4 className="font-medium mb-2">Revenue Projections</h4>
                        <p className="text-sm text-muted-foreground">{analysis.startupGuide.finance.revenueProjections}</p>
                      </Card>
                      <Card className="p-4 border-border/50 bg-gradient-to-br from-card to-muted/20">
                        <h4 className="font-medium mb-2">Break-Even Analysis</h4>
                        <p className="text-sm text-muted-foreground">{analysis.startupGuide.finance.breakEvenAnalysis}</p>
                      </Card>
                    </div>

                    {analysis.startupGuide.finance.fundingOptions && (
                      <Card className="p-5 border-border/50 bg-card/50">
                        <h4 className="font-medium mb-4">Funding Options</h4>
                        <div className="space-y-4">
                          {analysis.startupGuide.finance.fundingOptions.map((option, idx) => (
                            <div key={idx} className="p-4 border border-border/50 rounded-lg space-y-2 hover:bg-muted/30 transition-colors">
                              <h5 className="font-medium">{option.type}</h5>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                              <div className="grid md:grid-cols-2 gap-3 mt-3">
                                <div className="p-2 rounded bg-primary/10 border border-primary/20">
                                  <p className="text-xs font-medium text-primary mb-1">Pros:</p>
                                  <ul className="list-disc list-inside text-xs space-y-1">
                                    {option.pros.map((pro, pIdx) => (
                                      <li key={pIdx} className="text-muted-foreground">{pro}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="p-2 rounded bg-secondary/10 border border-secondary/20">
                                  <p className="text-xs font-medium text-secondary mb-1">Cons:</p>
                                  <ul className="list-disc list-inside text-xs space-y-1">
                                    {option.cons.map((con, cIdx) => (
                                      <li key={cIdx} className="text-muted-foreground">{con}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    {analysis.startupGuide.finance.financialMilestones && (
                      <Card className="p-5 border-border/50 bg-card/50">
                        <h4 className="font-medium mb-4">Financial Milestones</h4>
                        <div className="space-y-3">
                          {analysis.startupGuide.finance.financialMilestones.map((milestone, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-3 rounded-lg hover:bg-primary/5 transition-colors">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium">{milestone.milestone}</h5>
                                <p className="text-sm text-muted-foreground">{milestone.target}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{milestone.timeline}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No startup guide data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pros and Cons Tab */}
        <TabsContent value="pros-cons" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChartIcon className="w-5 h-5 text-primary" />
                Pros & Cons of This Field
              </CardTitle>
              <CardDescription>
                Balanced perspective on opportunities and challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis.prosAndCons ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <Card className="p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-card border-primary/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <ThumbsUp className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-primary">Advantages</h3>
                      </div>
                      <div className="space-y-3">
                        {analysis.prosAndCons.pros.map((pro, index) => (
                          <div key={index} className="flex gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">{pro.point}</h4>
                              <p className="text-sm text-muted-foreground">{pro.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Cons */}
                    <Card className="p-5 bg-gradient-to-br from-secondary/10 via-secondary/5 to-card border-secondary/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-2 mb-4">
                        <ThumbsDown className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-semibold text-secondary">Challenges</h3>
                      </div>
                      <div className="space-y-3">
                        {analysis.prosAndCons.cons.map((con, index) => (
                          <div key={index} className="flex gap-3 p-2 rounded-lg hover:bg-secondary/10 transition-colors">
                            <AlertTriangle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-sm mb-1">{con.point}</h4>
                              <p className="text-sm text-muted-foreground">{con.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Overall Assessment */}
                  {analysis.prosAndCons.overallAssessment && (
                    <Card className="p-5 bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-2">Overall Assessment</h4>
                          <p className="text-sm text-muted-foreground">{analysis.prosAndCons.overallAssessment}</p>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChartIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No pros and cons data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" onClick={onRestart} className="border-border/50 hover:border-primary/50">
          Start New Analysis
        </Button>
        <Button 
          onClick={() => {
            try {
              // Create PDF
              const doc = new jsPDF();
              let yPosition = 20;
              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();
              const margin = 15;
              const maxWidth = pageWidth - (margin * 2);

              // Helper function to add new page if needed
              const checkNewPage = (requiredSpace: number) => {
                if (yPosition + requiredSpace > pageHeight - margin) {
                  doc.addPage();
                  yPosition = margin;
                  return true;
                }
                return false;
              };

              // Helper function to add text with word wrapping
              const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
                doc.setFontSize(fontSize);
                const lines = doc.splitTextToSize(text, maxWidth);
                doc.text(lines, x, y);
                return lines.length * (fontSize * 0.5);
              };

              // Title and Header
              doc.setFontSize(20);
              doc.setFont('helvetica', 'bold');
              doc.text('CareerQuest - Scenario Analysis Report', margin, yPosition);
              yPosition += 10;

              doc.setFontSize(12);
              doc.setFont('helvetica', 'normal');
              doc.text(`Generated for: ${userName}`, margin, yPosition);
              yPosition += 6;
              doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
              yPosition += 6;
              
              if (analysis.fieldOfInterest || analysis.niche) {
                doc.text(`Field: ${analysis.fieldOfInterest || 'N/A'}${analysis.niche ? ` | Niche: ${analysis.niche}` : ''}`, margin, yPosition);
                yPosition += 10;
              } else {
                yPosition += 4;
              }

              // Draw a line
              doc.setLineWidth(0.5);
              doc.line(margin, yPosition, pageWidth - margin, yPosition);
              yPosition += 10;

              // Personality Profile Section
              if (analysis.personalityProfile && analysis.personalityProfile.length > 0) {
                checkNewPage(30);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Personality Profile', margin, yPosition);
                yPosition += 10;

                analysis.personalityProfile.forEach((trait, index) => {
                  checkNewPage(25);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`${index + 1}. ${trait.trait} (Score: ${trait.score}/100)`, margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPosition += addWrappedText(trait.description, margin, yPosition, maxWidth, 10);
                  yPosition += 5;

                  doc.setFont('helvetica', 'italic');
                  doc.setFontSize(9);
                  yPosition += addWrappedText(`Career Implications: ${trait.careerImplications}`, margin + 5, yPosition, maxWidth - 5, 9);
                  yPosition += 8;
                });
                yPosition += 5;
              }

              // Skill Gaps Section
              if (analysis.skillGaps && analysis.skillGaps.length > 0) {
                checkNewPage(30);
                doc.setLineWidth(0.3);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Skill Gap Analysis', margin, yPosition);
                yPosition += 10;

                analysis.skillGaps.forEach((gap, index) => {
                  checkNewPage(20);
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`${index + 1}. ${gap.skill}`, margin, yPosition);
                  yPosition += 6;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  doc.text(`Current Level: ${gap.currentLevel}/5 | Target Level: ${gap.targetLevel}/5`, margin + 5, yPosition);
                  yPosition += 5;
                  doc.text(`Priority: ${gap.importance.toFixed(1)}/5 | Gap: ${(gap.targetLevel - gap.currentLevel).toFixed(1)} levels`, margin + 5, yPosition);
                  yPosition += 8;
                });
                yPosition += 5;
              }

              // Learning Path Section
              if (analysis.learningPath && analysis.learningPath.length > 0) {
                checkNewPage(30);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Recommended Learning Path', margin, yPosition);
                yPosition += 10;

                analysis.learningPath.forEach((item, index) => {
                  checkNewPage(35);
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`${index + 1}. ${item.skill}`, margin, yPosition);
                  yPosition += 6;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPosition += addWrappedText(`Action: ${item.action}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 5;

                  doc.text(`Timeline: ${item.timeline}${item.difficultyLevel ? ` | Difficulty: ${item.difficultyLevel}` : ''}`, margin + 5, yPosition);
                  yPosition += 5;

                  if (item.resources && item.resources.length > 0) {
                    doc.text('Resources:', margin + 5, yPosition);
                    yPosition += 5;
                    item.resources.forEach(resource => {
                      yPosition += addWrappedText(`• ${resource}`, margin + 10, yPosition, maxWidth - 10, 9);
                    });
                  }

                  if (item.measurableOutcome) {
                    yPosition += 3;
                    doc.setFont('helvetica', 'italic');
                    yPosition += addWrappedText(`Expected Outcome: ${item.measurableOutcome}`, margin + 5, yPosition, maxWidth - 5, 9);
                    doc.setFont('helvetica', 'normal');
                  }
                  yPosition += 8;
                });
                yPosition += 5;
              }

              // Job Opportunities Section
              if (analysis.jobOpportunities && analysis.jobOpportunities.length > 0) {
                checkNewPage(30);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Job Opportunities & Salaries', margin, yPosition);
                yPosition += 10;

                analysis.jobOpportunities.forEach((job, index) => {
                  checkNewPage(35);
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text(`${index + 1}. ${job.title}`, margin, yPosition);
                  yPosition += 6;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  doc.text(`Company Type: ${job.companyType} | Experience: ${job.experienceLevel}`, margin + 5, yPosition);
                  yPosition += 5;
                  doc.setFont('helvetica', 'bold');
                  doc.text(`Salary: ${job.salaryRange}`, margin + 5, yPosition);
                  yPosition += 5;
                  doc.setFont('helvetica', 'normal');
                  doc.text(`Location: ${job.location}`, margin + 5, yPosition);
                  yPosition += 5;
                  yPosition += addWrappedText(`Growth Potential: ${job.growthPotential}`, margin + 5, yPosition, maxWidth - 5, 10);
                  
                  if (job.keySkills && job.keySkills.length > 0) {
                    yPosition += 5;
                    doc.text(`Key Skills: ${job.keySkills.join(', ')}`, margin + 5, yPosition);
                  }
                  yPosition += 10;
                });
                yPosition += 5;
              }

              // Startup Guide Section
              if (analysis.startupGuide) {
                checkNewPage(30);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Startup Guide', margin, yPosition);
                yPosition += 10;

                // How to Start
                if (analysis.startupGuide.howToStart) {
                  checkNewPage(25);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('How to Start', margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  doc.text(`Initial Investment: ${analysis.startupGuide.howToStart.initialInvestment}`, margin + 5, yPosition);
                  yPosition += 6;

                  if (analysis.startupGuide.howToStart.steps) {
                    analysis.startupGuide.howToStart.steps.forEach((step, idx) => {
                      checkNewPage(20);
                      doc.setFontSize(10);
                      doc.setFont('helvetica', 'bold');
                      doc.text(`${idx + 1}. ${step.step} (${step.timeline})`, margin + 5, yPosition);
                      yPosition += 5;
                      doc.setFont('helvetica', 'normal');
                      yPosition += addWrappedText(step.description, margin + 10, yPosition, maxWidth - 10, 9);
                      yPosition += 6;
                    });
                  }
                  yPosition += 5;
                }

                // Business Planning
                if (analysis.startupGuide.businessPlanning) {
                  checkNewPage(40);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Business Planning', margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPosition += addWrappedText(`Business Model: ${analysis.startupGuide.businessPlanning.businessModel}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 5;

                  if (analysis.startupGuide.businessPlanning.revenueStreams) {
                    doc.text(`Revenue Streams: ${analysis.startupGuide.businessPlanning.revenueStreams.join(', ')}`, margin + 5, yPosition);
                    yPosition += 5;
                  }

                  yPosition += addWrappedText(`Target Customers: ${analysis.startupGuide.businessPlanning.targetCustomers}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 8;
                }

                // Finance
                if (analysis.startupGuide.finance) {
                  checkNewPage(40);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Financial Planning', margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPosition += addWrappedText(`Startup Costs: ${analysis.startupGuide.finance.startupCosts}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 5;
                  yPosition += addWrappedText(`Revenue Projections: ${analysis.startupGuide.finance.revenueProjections}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 5;
                  yPosition += addWrappedText(`Break-Even Analysis: ${analysis.startupGuide.finance.breakEvenAnalysis}`, margin + 5, yPosition, maxWidth - 5, 10);
                  yPosition += 8;
                }
              }

              // Pros and Cons Section
              if (analysis.prosAndCons) {
                checkNewPage(40);
                doc.line(margin, yPosition, pageWidth - margin, yPosition);
                yPosition += 10;

                doc.setFontSize(16);
                doc.setFont('helvetica', 'bold');
                doc.text('Pros & Cons of This Field', margin, yPosition);
                yPosition += 10;

                // Pros
                if (analysis.prosAndCons.pros && analysis.prosAndCons.pros.length > 0) {
                  checkNewPage(25);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Advantages', margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  analysis.prosAndCons.pros.forEach((pro, idx) => {
                    checkNewPage(20);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${idx + 1}. ${pro.point}`, margin + 5, yPosition);
                    yPosition += 5;
                    doc.setFont('helvetica', 'normal');
                    yPosition += addWrappedText(pro.description, margin + 10, yPosition, maxWidth - 10, 9);
                    yPosition += 6;
                  });
                  yPosition += 5;
                }

                // Cons
                if (analysis.prosAndCons.cons && analysis.prosAndCons.cons.length > 0) {
                  checkNewPage(25);
                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Challenges', margin, yPosition);
                  yPosition += 7;

                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  analysis.prosAndCons.cons.forEach((con, idx) => {
                    checkNewPage(20);
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${idx + 1}. ${con.point}`, margin + 5, yPosition);
                    yPosition += 5;
                    doc.setFont('helvetica', 'normal');
                    yPosition += addWrappedText(con.description, margin + 10, yPosition, maxWidth - 10, 9);
                    yPosition += 6;
                  });
                  yPosition += 5;
                }

                // Overall Assessment
                if (analysis.prosAndCons.overallAssessment) {
                  checkNewPage(15);
                  doc.setFontSize(11);
                  doc.setFont('helvetica', 'bold');
                  doc.text('Overall Assessment', margin, yPosition);
                  yPosition += 6;
                  doc.setFont('helvetica', 'normal');
                  doc.setFontSize(10);
                  yPosition += addWrappedText(analysis.prosAndCons.overallAssessment, margin, yPosition, maxWidth, 10);
                }
              }

              // Footer
              const pageCount = doc.getNumberOfPages();
              for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.text(
                  `Page ${i} of ${pageCount} - CareerQuest Scenario Analysis`,
                  pageWidth / 2,
                  pageHeight - 10,
                  { align: 'center' }
                );
              }

              // Save the PDF
              const fileName = `CareerQuest_Scenario_Analysis_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
              doc.save(fileName);
            } catch (error) {
              console.error('Error exporting PDF:', error);
              alert('Failed to export PDF. Please try again.');
            }
          }}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Results as PDF
        </Button>
      </div>
    </div>
  );
};
