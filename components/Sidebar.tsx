'use client'

// Sidebar Component - Netflix-style navigation
// Javari TV - CR AudioViz AI
// Created: Feb 16, 2026

import { useState, useEffect } from 'react'
import { Star, Clock, ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Country, Region, City } from '@/lib/types'

interface SidebarProps {
  onNavigate: (selection: {
    country?: string
    region?: string
    city?: string
    view?: 'favorites' | 'recent' | 'browse'
  }) => void
  currentSelection: {
    country?: string
    region?: string
    city?: string
    view?: string
  }
}

export default function Sidebar({ onNavigate, currentSelection }: SidebarProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [regions, setRegions] = useState<Record<string, Region[]>>({})
  const [cities, setCities] = useState<Record<string, City[]>>({})
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set(['us']))
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCountries()
  }, [])

  async function loadCountries() {
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (data) {
      setCountries(data)
      // Auto-load regions for US
      loadRegions('us')
    }
  }

  async function loadRegions(countryId: string) {
    if (regions[countryId]) return // Already loaded
    
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('country_id', countryId)
      .order('name', { ascending: true })
    
    if (data) {
      setRegions(prev => ({ ...prev, [countryId]: data }))
      
      // Auto-expand Ohio if it's US
      if (countryId === 'us') {
        const ohio = data.find(r => r.code === 'OH')
        if (ohio) {
          loadCities(ohio.id)
          setExpandedRegions(prev => new Set(prev).add(ohio.id))
        }
      }
    }
  }

  async function loadCities(regionId: string) {
    if (cities[regionId]) return // Already loaded
    
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('region_id', regionId)
      .order('name', { ascending: true })
    
    if (data) {
      setCities(prev => ({ ...prev, [regionId]: data }))
    }
  }

  function toggleCountry(countryId: string) {
    const newExpanded = new Set(expandedCountries)
    if (newExpanded.has(countryId)) {
      newExpanded.delete(countryId)
    } else {
      newExpanded.add(countryId)
      loadRegions(countryId)
    }
    setExpandedCountries(newExpanded)
  }

  function toggleRegion(regionId: string) {
    const newExpanded = new Set(expandedRegions)
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId)
    } else {
      newExpanded.add(regionId)
      loadCities(regionId)
    }
    setExpandedRegions(newExpanded)
  }

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen overflow-y-auto custom-scrollbar flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-500">JAVARI TV</h1>
        <p className="text-xs text-gray-400 mt-1">10,000+ Live Channels</p>
      </div>

      {/* Quick Access */}
      <nav className="flex-1">
        <div className="p-2">
          {/* Favorites */}
          <button
            onClick={() => onNavigate({ view: 'favorites' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition ${
              currentSelection.view === 'favorites' ? 'bg-gray-800' : ''
            }`}
          >
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Favorites</span>
          </button>

          {/* Recently Watched */}
          <button
            onClick={() => onNavigate({ view: 'recent' })}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition ${
              currentSelection.view === 'recent' ? 'bg-gray-800' : ''
            }`}
          >
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Recent</span>
          </button>
        </div>

        <hr className="border-gray-800 my-2" />

        {/* Countries Tree */}
        <div className="p-2">
          <div className="text-xs font-bold text-gray-500 uppercase px-3 py-2">
            Browse by Country
          </div>

          {countries.map(country => {
            const isExpanded = expandedCountries.has(country.id)
            const countryRegions = regions[country.id] || []

            return (
              <div key={country.id} className="mb-1">
                {/* Country Row */}
                <div className="flex items-center">
                  <button
                    onClick={() => toggleCountry(country.id)}
                    className="flex-1 flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-lg">{country.flag_emoji}</span>
                    <span className="font-medium">{country.name}</span>
                  </button>
                </div>

                {/* National Channels Link */}
                {isExpanded && (
                  <div className="ml-9">
                    <button
                      onClick={() => onNavigate({ country: country.id, view: 'browse' })}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-800 transition ${
                        currentSelection.country === country.id && !currentSelection.region
                          ? 'bg-gray-800 text-blue-400'
                          : 'text-gray-300'
                      }`}
                    >
                      📺 National Channels
                    </button>

                    {/* Regions */}
                    {countryRegions.map(region => {
                      const isRegionExpanded = expandedRegions.has(region.id)
                      const regionCities = cities[region.id] || []

                      return (
                        <div key={region.id} className="mt-1">
                          {/* Region Row */}
                          <button
                            onClick={() => toggleRegion(region.id)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-gray-800 transition text-left"
                          >
                            {isRegionExpanded ? (
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                            )}
                            <span>📍 {region.name}</span>
                          </button>

                          {/* Cities */}
                          {isRegionExpanded && (
                            <div className="ml-6">
                              {regionCities.map(city => (
                                <button
                                  key={city.id}
                                  onClick={() =>
                                    onNavigate({
                                      country: country.id,
                                      region: region.id,
                                      city: city.id,
                                      view: 'browse',
                                    })
                                  }
                                  className={`w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-800 transition ${
                                    currentSelection.city === city.id
                                      ? 'bg-gray-800 text-blue-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  {city.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
        <p>© 2026 CR AudioViz AI</p>
        <p className="mt-1">
          Javari TV provides links to publicly available streams. We do not host any content.
        </p>
      </div>
    </aside>
  )
}
