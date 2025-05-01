
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, TriageLevel } from '../utils/types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [triageData, setTriageData] = useState<any[]>([]);
  const [ageDistribution, setAgeDistribution] = useState<any[]>([]);
  const [genderDistribution, setGenderDistribution] = useState<any[]>([]);

  const COLORS = [
    '#d32f2f', // Critical - Red
    '#f57c00', // Emergency - Orange
    '#ffa000', // Urgent - Amber
    '#388e3c', // Standard - Green
    '#0288d1'  // Non-urgent - Blue
  ];

  useEffect(() => {
    // Check if logged in
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn) {
      navigate('/login');
      return;
    }

    // Load patients from localStorage
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      const parsedPatients = JSON.parse(storedPatients);
      setPatients(parsedPatients);

      // Process data for charts
      processTriageData(parsedPatients);
      processAgeDistribution(parsedPatients);
      processGenderDistribution(parsedPatients);
    }
  }, [navigate]);

  const processTriageData = (patients: Patient[]) => {
    const triageLevels = ['critical', 'emergency', 'urgent', 'standard', 'nonurgent'];
    const data = triageLevels.map(level => {
      const count = patients.filter(patient => patient.triageLevel === level).length;
      return { 
        name: level.charAt(0).toUpperCase() + level.slice(1), 
        value: count,
      };
    });
    setTriageData(data);
  };

  const processAgeDistribution = (patients: Patient[]) => {
    // Group patients by age range
    const ageRanges = {
      '0-18': { name: '0-18', count: 0 },
      '19-35': { name: '19-35', count: 0 },
      '36-50': { name: '36-50', count: 0 },
      '51-65': { name: '51-65', count: 0 },
      '66+': { name: '66+', count: 0 },
    };

    patients.forEach(patient => {
      const age = patient.age;
      if (age <= 18) ageRanges['0-18'].count++;
      else if (age <= 35) ageRanges['19-35'].count++;
      else if (age <= 50) ageRanges['36-50'].count++;
      else if (age <= 65) ageRanges['51-65'].count++;
      else ageRanges['66+'].count++;
    });

    setAgeDistribution(Object.values(ageRanges));
  };

  const processGenderDistribution = (patients: Patient[]) => {
    const genderCounts = {
      'Male': { name: 'Male', count: 0 },
      'Female': { name: 'Female', count: 0 },
    };

    patients.forEach(patient => {
      if (patient.gender === 'Male') {
        genderCounts['Male'].count++;
      } else if (patient.gender === 'Female') {
        genderCounts['Female'].count++;
      }
    });

    setGenderDistribution(Object.values(genderCounts));
  };

  const getTriageColor = (level: TriageLevel) => {
    switch (level) {
      case 'critical': return '#d32f2f';
      case 'emergency': return '#f57c00';
      case 'urgent': return '#ffa000';
      case 'standard': return '#388e3c';
      case 'nonurgent': return '#0288d1';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Analytics Dashboard" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Triage Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={triageData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {triageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageDistribution}
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
                  <Bar dataKey="count" name="Number of Patients" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={genderDistribution}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Patients" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="text-sm text-blue-700">Total Patients</div>
                  <div className="text-3xl font-bold">{patients.length}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-md">
                  <div className="text-sm text-amber-700">Avg. Urgency</div>
                  <div className="text-3xl font-bold">
                    {patients.length > 0 
                      ? Math.round(patients.reduce((sum, p) => sum + p.urgencyPercentage, 0) / patients.length) 
                      : 0}%
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="text-sm text-green-700">Avg. Age</div>
                  <div className="text-3xl font-bold">
                    {patients.length > 0 
                      ? Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length) 
                      : 0}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-md">
                  <div className="text-sm text-purple-700">Critical Cases</div>
                  <div className="text-3xl font-bold">
                    {patients.filter(p => p.triageLevel === 'critical').length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
