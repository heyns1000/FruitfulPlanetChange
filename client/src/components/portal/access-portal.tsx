import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type AccessType = 'loyalty' | 'shareholder' | 'service' | 'family';

interface FormData {
  [key: string]: string | boolean | File | null;
}

export function AccessPortal() {
  const [selectedAccess, setSelectedAccess] = useState<AccessType | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const accessTypes = [
    {
      id: 'loyalty' as AccessType,
      title: 'Loyalty Access',
      icon: '🪙',
      description: 'Brand partners, rewards & alliance view',
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200'
    },
    {
      id: 'shareholder' as AccessType,
      title: 'Shareholder Access',
      icon: '📊',
      description: 'Governance & ecosystem metrics dashboard',
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-200'
    },
    {
      id: 'service' as AccessType,
      title: 'Service Provider',
      icon: '🤝',
      description: 'Integration & deployment tools',
      color: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-200'
    },
    {
      id: 'family' as AccessType,
      title: 'Family Access',
      icon: '👨‍👩‍👧‍👦',
      description: 'Personal vaults, archive access & memory mesh',
      color: 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200'
    }
  ];

  const handleInputChange = (key: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!selectedAccess) return false;
    
    const requiredFields = {
      'loyalty': ['fullName', 'email', 'acceptTerms'],
      'service': ['companyName', 'registrationNumber', 'officialEmail', 'confirmService'],
      'family': ['representativeName', 'familyName', 'email', 'password', 'confirmPassword'],
      'shareholder': [] // No validation needed for shareholder
    };
    
    const required = requiredFields[selectedAccess];
    
    for (const field of required) {
      if (!formData[field] || formData[field] === '') {
        return false;
      }
    }
    
    // Additional validation for family access passwords
    if (selectedAccess === 'family') {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("📨 Access Registration Submission:", { type: selectedAccess, data: formData });
    
    toast({
      title: "Registration Submitted",
      description: "Your access request has been received. You will get an activation email from vault@faa.zone shortly.",
    });
    
    setSubmitted(true);
  };

  const renderForm = () => {
    switch (selectedAccess) {
      case 'loyalty':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                🪙 Loyalty Access Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Full Name" 
                  required
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Input 
                  type="tel" 
                  placeholder="Phone Number" 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                <Input 
                  placeholder="Vault / Family Name" 
                  onChange={(e) => handleInputChange('vaultName', e.target.value)}
                />
                <Input 
                  type="date" 
                  placeholder="Date of Birth" 
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
                <Input 
                  type="number" 
                  placeholder="Age" 
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
                <Input 
                  placeholder="Referral Code (optional)" 
                  onChange={(e) => handleInputChange('referralCode', e.target.value)}
                />
              </div>
              <Textarea 
                placeholder="What does loyalty mean to you?" 
                className="col-span-2"
                onChange={(e) => handleInputChange('loyaltyMeaning', e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="loyalty-terms"
                  required
                  onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                />
                <Label htmlFor="loyalty-terms" className="text-sm">
                  I understand this is a lifelong journey and relationship request. <span className="text-red-500">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'service':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                🤝 Service Provider Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Company Name" 
                  required
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
                <Input 
                  placeholder="Registration / FICA Number" 
                  required
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                />
                <Input 
                  placeholder="Country of Operation" 
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
                <Input 
                  type="email" 
                  placeholder="Official Email Address" 
                  required
                  onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                />
                <Input 
                  type="tel" 
                  placeholder="Primary Contact Number" 
                  onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                />
                <Input 
                  placeholder="Company Director Full Name" 
                  onChange={(e) => handleInputChange('directorName', e.target.value)}
                />
                <Input 
                  placeholder="24/7 Service Contact Name" 
                  onChange={(e) => handleInputChange('serviceContact', e.target.value)}
                />
                <Input 
                  type="file" 
                  onChange={(e) => handleInputChange('documents', e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="service-terms"
                  required
                  onCheckedChange={(checked) => handleInputChange('confirmService', checked)}
                />
                <Label htmlFor="service-terms" className="text-sm">
                  I confirm this company offers 24/7 service and support. <span className="text-red-500">*</span>
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'family':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center gap-2">
                👨‍👩‍👧‍👦 Family Access Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Family Representative Name" 
                  required
                  onChange={(e) => handleInputChange('representativeName', e.target.value)}
                />
                <Input 
                  placeholder="Family Name" 
                  required
                  onChange={(e) => handleInputChange('familyName', e.target.value)}
                />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <Input 
                  type="date" 
                  placeholder="Date of Birth" 
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
                <Input 
                  type="number" 
                  placeholder="Age" 
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
                <Input 
                  placeholder="Desired Username" 
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                <Input 
                  type="password" 
                  placeholder="Create Password" 
                  required
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <Input 
                  type="password" 
                  placeholder="Confirm Password" 
                  required
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                <Input 
                  type="file" 
                  onChange={(e) => handleInputChange('documents', e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="family-vault"
                  onCheckedChange={(checked) => handleInputChange('generateVault', checked)}
                />
                <Label htmlFor="family-vault">
                  Generate my vault at: faa.zone/public/FamilyName/username-password.html
                </Label>
              </div>
            </CardContent>
          </Card>
        );

      case 'shareholder':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                📊 Welcome Shareholder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Governance tools and ecosystem metrics will be enabled during onboarding.
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-indigo-700">🌐 Seedwave™ Access Portal</h1>
        <p className="text-gray-600 mt-1">
          Corebrands management & AI logic deployment center™
        </p>
      </header>

      {/* Access Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        {accessTypes.map((access) => (
          <Card 
            key={access.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${access.color} ${
              selectedAccess === access.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => {
              setSelectedAccess(access.id);
              setSubmitted(false);
              setFormData({});
            }}
          >
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">{access.icon}</div>
              <div className="text-xl font-semibold">{access.title}</div>
              <p className="text-sm mt-1">{access.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Dynamic Form Section */}
      {selectedAccess && (
        <section className="max-w-5xl mx-auto space-y-6">
          {renderForm()}

          {!submitted && (
            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2"
              >
                ✅ Submit Registration
              </Button>
            </div>
          )}

          {submitted && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <p className="text-green-700 font-semibold">
                  🎉 Your access request has been received. You will get an activation email from{' '}
                  <strong>vault@faa.zone</strong> shortly.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-16">
        FAA.Zone Mesh • TreatyMesh Certified • All roles encrypted & routed via ⛓️ SecureScroll✂
      </footer>
    </div>
  );
}