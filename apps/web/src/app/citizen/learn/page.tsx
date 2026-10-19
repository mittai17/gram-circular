'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Check, X, Sparkles, HelpCircle } from 'lucide-react';

export default function CitizenLearnPage() {
  const [lang, setLang] = React.useState('en');

  return (
    <AppLayout
      headerProps={{
        title: 'Waste Segregation Guide',
        subtitle: 'Bilingual illustrated guide to Multilayer Plastics (MLP) and home waste streams',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Language Tabs */}
        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1a5c38]" />
            <span className="text-xs font-bold text-gray-900">Select Language / மொழியைத் தேர்ந்தெடுக்கவும்:</span>
          </div>
          <Tabs value={lang} onValueChange={setLang}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ta">தமிழ் (Tamil)</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* English Content */}
        {lang === 'en' ? (
          <div className="space-y-6">
            {/* Category 1: MLP */}
            <Card className="border-l-4 border-l-[#1a5c38]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-gray-900">
                    1. Multilayer Plastics (MLP) - Shiny Foil & Sachets
                  </CardTitle>
                  <Badge variant="primary">Special Rural Collection</Badge>
                </div>
                <CardDescription className="text-xs">
                  Hard-to-recycle thin laminated plastic with aluminum or polymer layers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      YES: Put in MLP Bag
                    </p>
                    <ul className="space-y-1 text-emerald-900">
                      <li>• Chips and Kurkure snack wrappers (shiny silver inside)</li>
                      <li>• Biscuit packaging and chocolate foil wrappers</li>
                      <li>• Single-use shampoo, detergent, and oil sachets</li>
                      <li>• Toothpaste tubes and empty medicine blister packs</li>
                      <li>• Atta, rice, and spice printed laminate pouches</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <p className="font-bold text-red-950 flex items-center gap-1.5 mb-2">
                      <X className="w-4 h-4 text-red-700" />
                      NO: Do NOT Put in MLP
                    </p>
                    <ul className="space-y-1 text-red-900">
                      <li>• Food scraps or wet gravy (Wash or wipe wrappers first)</li>
                      <li>• Rigid PET bottles (belongs to Dry Recyclables)</li>
                      <li>• Paper cartons / Tetra Paks</li>
                      <li>• Used diapers or tissues (Sanitary waste)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category 2: Dry Recyclables */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-900">
                  2. Dry Recyclables (Paper, Glass, Rigid Plastics)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-gray-700">
                <p>
                  Clean cardboard boxes, newspapers, plastic oil cans, hard buckets, glass bottles, and tin cans.
                  Keep dry and uncontaminated.
                </p>
              </CardContent>
            </Card>

            {/* Category 3: Wet Organic */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-900">
                  3. Wet Biodegradable Waste
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-gray-700">
                <p>
                  Kitchen waste, tea leaves, fruit peels, egg shells, cooked leftover food.
                  Collected daily for village vermicomposting pits.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Tamil Content */
          <div className="space-y-6">
            <Card className="border-l-4 border-l-[#1a5c38]">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold text-gray-900">
                    1. பல அடுக்கு பிளாஸ்டிக் (MLP) - பளபளப்பான பாக்கெட்டுகள்
                  </CardTitle>
                  <Badge variant="primary">சிறப்பு கிராமப்புற சேகரிப்பு</Badge>
                </div>
                <CardDescription className="text-xs">
                  அலுமினியம் கலந்த மெல்லிய சிற்றுண்டி உறைகள்
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
                      <Check className="w-4 h-4 text-emerald-700" />
                      ஆம்: இந்த பையில் போடவும்
                    </p>
                    <ul className="space-y-1 text-emerald-900">
                      <li>• குர்குரே, சிப்ஸ் மற்றும் பிஸ்கட் உறைகள்</li>
                      <li>• ஷாம்பு, சோப் மற்றும் எண்ணெய் சாச்செட்டுகள்</li>
                      <li>• பற்பசை குழாய்கள் மற்றும் மாத்திரை உறைகள்</li>
                      <li>• மசாலா, மாவு மற்றும் பால் பாக்கெட்டுகள்</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded-xl border border-red-200">
                    <p className="font-bold text-red-950 flex items-center gap-1.5 mb-2">
                      <X className="w-4 h-4 text-red-700" />
                      இல்லை: இதில் போடக்கூடாது
                    </p>
                    <ul className="space-y-1 text-red-900">
                      <li>• உணவு கழிவுகள் அல்லது ஈரமான சாம்பார்</li>
                      <li>• தண்ணீர் பாட்டில்கள் (PET பாட்டில்கள்)</li>
                      <li>• பயன்படுத்திய நாப்கின்கள்</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-900">
                  2. உலர் மறுசுழற்சி கழிவுகள்
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-gray-700">
                <p>காகித அட்டைகள், செய்தி தாள்கள், பிளாஸ்டிக் பக்கெட்டுகள், கண்ணாடி பாட்டில்கள்.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-900">
                  3. ஈரமான மக்கும் கழிவுகள்
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 text-gray-700">
                <p>சமையலறை காய்கறி கழிவுகள், பழத்தோல்கள், மீதமுள்ள உணவுகள் - மண்புழு உரத்திற்கு சேகரிக்கப்படும்.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
