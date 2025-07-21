import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Globe, Users, Scale, Filter, Star, AlertTriangle } from 'lucide-react';

interface LawFirm {
  _id: string;
  firm_name: string;
  description_en: string;
  description_sw: string;
  specializations: string[];
  location: string;
  contact_email: string;
  contact_phone: string;
  website_url?: string;
  is_sponsored: boolean;
  logo_url?: string;
  rating?: number;
  review_count?: number;
}

const FindLawyerPage = () => {
  const { t, i18n } = useTranslation(['common', 'navigation']);
  const [lawFirms, setLawFirms] = useState<LawFirm[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const specializations = [
    { id: 'all', name_en: 'All Specializations', name_sw: 'Utaalamu Wote' },
    { id: 'family-law', name_en: 'Family Law', name_sw: 'Sheria ya Familia' },
    { id: 'criminal-law', name_en: 'Criminal Law', name_sw: 'Sheria ya Jinai' },
    { id: 'corporate-law', name_en: 'Corporate Law', name_sw: 'Sheria ya Makampuni' },
    { id: 'property-law', name_en: 'Property Law', name_sw: 'Sheria ya Mali' },
    { id: 'employment-law', name_en: 'Employment Law', name_sw: 'Sheria ya Ajira' },
    { id: 'human-rights', name_en: 'Human Rights', name_sw: 'Haki za Binadamu' },
  ];

  const locations = [
    { id: 'all', name_en: 'All Locations', name_sw: 'Maeneo Yote' },
    { id: 'mombasa', name_en: 'Mombasa County', name_sw: 'Kaunti ya Mombasa' },
    { id: 'nairobi', name_en: 'Nairobi County', name_sw: 'Kaunti ya Nairobi' },
    { id: 'coastal', name_en: 'Coastal Region', name_sw: 'Mkoa wa Pwani' },
  ];

  useEffect(() => {
    fetchLawFirms();
  }, []);

  const fetchLawFirms = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData: LawFirm[] = [
        {
          _id: '1',
          firm_name: 'Mombasa Legal Associates',
          description_en: 'Leading law firm in Mombasa specializing in corporate and family law with over 20 years of experience.',
          description_sw: 'Kampuni ya wakili inayoongoza Mombasa inayofanya kazi katika sheria ya makampuni na familia kwa zaidi ya miaka 20.',
          specializations: ['corporate-law', 'family-law'],
          location: 'mombasa',
          contact_email: 'info@mombasalegal.co.ke',
          contact_phone: '+254-41-2234567',
          website_url: 'https://mombasalegal.co.ke',
          is_sponsored: true,
          rating: 4.5,
          review_count: 127
        },
        {
          _id: '2',
          firm_name: 'Coast Criminal Defense',
          description_en: 'Specialized criminal defense attorneys serving the coastal region with expertise in constitutional law.',
          description_sw: 'Wakili wa utetezi wa jinai wanaofanya kazi katika mkoa wa pwani na utaalamu katika sheria ya kikatiba.',
          specializations: ['criminal-law', 'human-rights'],
          location: 'coastal',
          contact_email: 'defense@coastcriminal.co.ke',
          contact_phone: '+254-41-2345678',
          is_sponsored: false,
          rating: 4.2,
          review_count: 89
        },
        {
          _id: '3',
          firm_name: 'Pwani Property Lawyers',
          description_en: 'Expert property and land law services for individuals and businesses in the coastal region.',
          description_sw: 'Huduma za utaalamu za sheria ya mali na ardhi kwa watu binafsi na biashara katika mkoa wa pwani.',
          specializations: ['property-law'],
          location: 'mombasa',
          contact_email: 'info@pwaniproperty.co.ke',
          contact_phone: '+254-41-2456789',
          website_url: 'https://pwaniproperty.co.ke',
          is_sponsored: true,
          rating: 4.7,
          review_count: 203
        }
      ];
      setLawFirms(mockData);
    } catch (error) {
      console.error('Error fetching law firms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLawFirms = lawFirms.filter(firm => {
    const specializationMatch = selectedSpecialization === 'all' || 
      firm.specializations.includes(selectedSpecialization);
    const locationMatch = selectedLocation === 'all' || firm.location === selectedLocation;
    return specializationMatch && locationMatch;
  });

  // Sort to show sponsored firms first
  const sortedLawFirms = [...filteredLawFirms].sort((a, b) => {
    if (a.is_sponsored && !b.is_sponsored) return -1;
    if (!a.is_sponsored && b.is_sponsored) return 1;
    return 0;
  });

  const getDescription = (firm: LawFirm) => {
    return i18n.language === 'sw' ? firm.description_sw : firm.description_en;
  };

  const getSpecializationName = (spec: any) => {
    return i18n.language === 'sw' ? spec.name_sw : spec.name_en;
  };

  const getLocationName = (loc: any) => {
    return i18n.language === 'sw' ? loc.name_sw : loc.name_en;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Scale className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Scale className="mr-4 h-10 w-10 text-green-600" />
            {t('navigation:findLawyer')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {i18n.language === 'sw' 
              ? 'Tafuta makampuni ya wakili na wataalamu wa kisheria katika eneo lako.'
              : 'Find law firms and legal professionals in your area.'
            }
          </p>
        </div>

        {/* Transparency Notice */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                {t('importantNotice')}
              </h2>
              <p className="text-amber-800 leading-relaxed">
                {i18n.language === 'sw' 
                  ? 'Baadhi ya orodha hapa ni tangazo la kulipwa. Makampuni yaliyoonyeshwa kama "Yaliyodhaminiwa" yamelipa kwa ajili ya nafasi hii. Hii si uthibitisho wa huduma zao. SheriaBot haiwezi kutoa ushauri wa kisheria wa kibinafsi. Wasiliana moja kwa moja na makampuni haya kwa ajili ya ushauri wa kisheria.'
                  : 'Some listings here are paid advertisements. Firms marked as "Sponsored" have paid for placement. This is not an endorsement of their services. SheriaBot cannot provide personalized legal advice. Contact these firms directly for legal consultation.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">{t('filter')} {t('navigation:findLawyer')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {i18n.language === 'sw' ? 'Utaalamu' : 'Specialization'}
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {specializations.map(spec => (
                  <option key={spec.id} value={spec.id}>
                    {getSpecializationName(spec)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('location')}
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {getLocationName(location)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Law Firms Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedLawFirms.map((firm) => (
            <div key={firm._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
              {/* Sponsored Badge */}
              {firm.is_sponsored && (
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                    {t('sponsored')}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-16">{firm.firm_name}</h3>
                  {firm.rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(firm.rating!) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {firm.rating} ({firm.review_count} {i18n.language === 'sw' ? 'mapitio' : 'reviews'})
                      </span>
                    </div>
                  )}
                </div>
                <Scale className="h-6 w-6 text-green-600 flex-shrink-0" />
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{getDescription(firm)}</p>

              {/* Contact Information */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{firm.contact_phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{firm.contact_email}</span>
                </div>
                {firm.website_url && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
                    <a 
                      href={firm.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 hover:underline"
                    >
                      {t('website')}
                    </a>
                  </div>
                )}
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{firm.location}</span>
                </div>
              </div>

              {/* Specializations */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {i18n.language === 'sw' ? 'Utaalamu' : 'Specializations'}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {firm.specializations.map((spec, index) => {
                    const specObj = specializations.find(s => s.id === spec);
                    return (
                      <span 
                        key={index}
                        className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {specObj ? getSpecializationName(specObj) : spec}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  {i18n.language === 'sw' ? 'Wasiliana' : 'Contact Firm'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedLawFirms.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('noResults')}</h3>
            <p className="text-gray-500">
              {i18n.language === 'sw' 
                ? 'Jaribu kubadilisha vichujio vyako kuona matokeo zaidi.'
                : 'Try adjusting your filters to see more results.'
              }
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('legalNotice')}</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              {i18n.language === 'sw' 
                ? 'SheriaBot ni jukwaa la taarifa tu na haliwezi kutoa ushauri wa kisheria wa kibinafsi. Makampuni yaliyoorodheshwa hapa ni kwa madhumuni ya taarifa tu na hayawakilishi uthibitisho wa huduma zao.'
                : 'SheriaBot is an information platform only and cannot provide personalized legal advice. Law firms listed here are for informational purposes only and do not represent an endorsement of their services.'
              }
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {i18n.language === 'sw' 
                ? 'Makampuni yaliyoonyeshwa kama "Yaliyodhaminiwa" yamelipa kwa ajili ya nafasi katika orodha hii. Hii ni uwazi mkuu na haiathiri ubora wa huduma zao.'
                : 'Firms marked as "Sponsored" have paid for placement in this directory. This is full transparency and does not affect the quality of their services.'
              }
            </p>
            <p className="text-gray-700 leading-relaxed">
              {i18n.language === 'sw' 
                ? 'Kwa ushauri wa kisheria wa kibinafsi, wasiliana moja kwa moja na wakili aliyeidhinishwa. Hakikisha kuuliza kuhusu ada, utaalamu, na uzoefu kabla ya kuchagua wakili.'
                : 'For personalized legal advice, contact a licensed attorney directly. Be sure to ask about fees, expertise, and experience before choosing a lawyer.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindLawyerPage;