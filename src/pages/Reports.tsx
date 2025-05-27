
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', assignments: 18, revenue: 36000 },
    { name: 'Feb', assignments: 22, revenue: 44000 },
    { name: 'Mar', assignments: 28, revenue: 56000 },
    { name: 'Apr', assignments: 32, revenue: 64000 },
    { name: 'May', assignments: 35, revenue: 70000 },
  ];
  
  const skillDistribution = [
    { name: 'Embroidery', value: 35 },
    { name: 'Block Printing', value: 20 },
    { name: 'Metalwork', value: 15 },
    { name: 'Weaving', value: 10 },
    { name: 'Wood Carving', value: 8 },
    { name: 'Other', value: 12 },
  ];
  
  const performanceData = [
    { name: 'Ramesh Kumar', performance: 95, assignments: 36 },
    { name: 'Suman Devi', performance: 88, assignments: 42 },
    { name: 'Ahmed Khan', performance: 91, assignments: 51 },
    { name: 'Lakshmi Patel', performance: 84, assignments: 28 },
    { name: 'Rajesh Sharma', performance: 93, assignments: 63 },
  ];
  
  const COLORS = ['#c89022', '#da9e23', '#e8b54c', '#f1c876', '#f8dba0', '#ffe9c2'];
  
  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-karigar-800 dark:text-karigar-200">Reports</h1>
          <p className="text-muted-foreground mt-2">Track performance and generate insights.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="2025">
            <SelectTrigger className="w-full sm:w-[100px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="ml-auto">
            <Button variant="outline">
              Export Reports
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-0">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Karigar</CardTitle>
                  <CardDescription>Showing top performers based on quality and timeliness.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="performance" name="Performance Score" fill="#c89022" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Volume by Karigar</CardTitle>
                  <CardDescription>Number of assignments completed by each karigar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="assignments" name="Total Assignments" fill="#8b5cf6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue and Assignments</CardTitle>
                <CardDescription>Track revenue and assignment volume over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#c89022" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="assignments" name="Assignments" stroke="#0ea5e9" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distribution" className="mt-0">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Distribution</CardTitle>
                  <CardDescription>Distribution of karigars by skill category.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-[350px] w-full max-w-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={skillDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {skillDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} karigars`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators and stats.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Average Completion Time</div>
                      <div className="text-2xl font-bold text-karigar-700 dark:text-karigar-300">12 days</div>
                      <div className="text-xs text-green-600">-2 days vs. last period</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Average Rating</div>
                      <div className="text-2xl font-bold text-karigar-700 dark:text-karigar-300">4.7/5</div>
                      <div className="text-xs text-green-600">+0.2 vs. last period</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                      <div className="text-2xl font-bold text-karigar-700 dark:text-karigar-300">92%</div>
                      <div className="text-xs text-amber-600">-3% vs. last period</div>
                    </div>
                    
                    <div className="space-y-2 border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">Avg. Revenue Per Karigar</div>
                      <div className="text-2xl font-bold text-karigar-700 dark:text-karigar-300">₹21,500</div>
                      <div className="text-xs text-green-600">+₹2,300 vs. last period</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Reports;
