'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  Cloud, 
  Server, 
  MapPin, 
  Briefcase, 
  Sliders, 
  ChevronRight, 
  DollarSign, 
  Layers, 
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<'salary' | 'cloud'>('salary');

  // ==========================================
  // SALARY CALCULATOR STATE & LOGIC
  // ==========================================
  const [role, setRole] = useState('frontend');
  const [experience, setExperience] = useState(3);
  const [location, setLocation] = useState('jakarta');
  const [skills, setSkills] = useState<string[]>([]);
  const [estimatedSalary, setEstimatedSalary] = useState({ min: 0, max: 0 });

  const roles = [
    { id: 'frontend', name: 'Frontend Developer', base: 7500000 },
    { id: 'backend', name: 'Backend Developer', base: 8500000 },
    { id: 'devops', name: 'DevOps / SRE Engineer', base: 9500000 },
    { id: 'ai', name: 'AI / Machine Learning Engineer', base: 11000000 },
    { id: 'mobile', name: 'Mobile Developer (iOS/Android)', base: 8000000 },
    { id: 'cyber', name: 'Cyber Security Specialist', base: 9000000 },
    { id: 'pm', name: 'Product Manager', base: 8500000 }
  ];

  const locations = [
    { id: 'jakarta', name: 'Jakarta (Jabodetabek)', modifier: 1.15 },
    { id: 'bandung', name: 'Bandung', modifier: 1.0 },
    { id: 'surabaya', name: 'Surabaya', modifier: 0.95 },
    { id: 'yogyakarta', name: 'Yogyakarta', modifier: 0.8 },
    { id: 'outside', name: 'Luar Pulau Jawa', modifier: 0.75 }
  ];

  const availableSkills = [
    { id: 'react', name: 'React / Next.js', bonus: 0.05 },
    { id: 'go', name: 'Golang / Rust', bonus: 0.08 },
    { id: 'k8s', name: 'Kubernetes / Docker', bonus: 0.07 },
    { id: 'cloud_cert', name: 'Cloud Cert (AWS/GCP)', bonus: 0.06 },
    { id: 'ai_llm', name: 'LLMs / PyTorch', bonus: 0.09 },
    { id: 'system_design', name: 'System Design', bonus: 0.08 }
  ];

  const toggleSkill = (id: string) => {
    if (skills.includes(id)) {
      setSkills(skills.filter(s => s !== id));
    } else {
      setSkills([...skills, id]);
    }
  };

  useEffect(() => {
    const selectedRole = roles.find(r => r.id === role) || roles[0];
    const selectedLoc = locations.find(l => l.id === location) || locations[0];
    
    // Calculate experience factor
    let expFactor = 1.0;
    if (experience <= 2) {
      expFactor = 1.0 + (experience * 0.15); // Jr
    } else if (experience <= 5) {
      expFactor = 1.35 + ((experience - 2) * 0.25); // Mid
    } else if (experience <= 9) {
      expFactor = 2.1 + ((experience - 5) * 0.35); // Sr
    } else {
      expFactor = 3.5 + ((experience - 9) * 0.15); // Lead/Principal (capped scale)
    }

    // Calculate skill bonus factor
    let skillBonus = 0;
    skills.forEach(s => {
      const match = availableSkills.find(sk => sk.id === s);
      if (match) skillBonus += match.bonus;
    });

    const baseCalculated = selectedRole.base * expFactor * selectedLoc.modifier * (1 + skillBonus);
    
    // Apply standard spread for min/max
    const minSal = Math.floor(baseCalculated * 0.9);
    const maxSal = Math.floor(baseCalculated * 1.15);
    
    setEstimatedSalary({ min: minSal, max: maxSal });
  }, [role, experience, location, skills]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // ==========================================
  // CLOUD CALCULATOR STATE & LOGIC
  // ==========================================
  const [traffic, setTraffic] = useState(100000); // monthly visitors
  const [dbStorage, setDbStorage] = useState(50); // GB
  const [fileStorage, setFileStorage] = useState(100); // GB
  const [cloudCosts, setCloudCosts] = useState({ vps: 0, aws: 0, gcp: 0, azure: 0 });

  useEffect(() => {
    // 1. VPS Traditional (DigitalOcean/Linode Style) - Linier, efisien
    const vpsCompute = Math.max(10, Math.ceil(traffic / 150000) * 15); // $15 per 150k visitors
    const vpsDisk = (dbStorage + fileStorage) * 0.15; // $0.15/GB
    const vpsTotal = (vpsCompute + vpsDisk) * 15500; // convert to IDR
    
    // 2. AWS (Load Balancer, NAT Gateways, Multi-AZ) - Enterprise base, scaling bandwidth
    const awsBase = 65; // minimum LB + micro instances
    const awsCompute = Math.ceil(traffic / 80000) * 28; // scaling instances
    const awsBandwidth = (traffic * 0.0005) * 0.08; // 0.5MB per pageview, $0.08/GB bandwidth
    const awsDisk = (dbStorage * 0.25) + (fileStorage * 0.08); // high EBS/S3 costs
    const awsTotal = (awsBase + awsCompute + awsBandwidth + awsDisk) * 15500;

    // 3. GCP
    const gcpBase = 55;
    const gcpCompute = Math.ceil(traffic / 90000) * 26;
    const gcpBandwidth = (traffic * 0.0005) * 0.075;
    const gcpDisk = (dbStorage * 0.22) + (fileStorage * 0.07);
    const gcpTotal = (gcpBase + gcpCompute + gcpBandwidth + gcpDisk) * 15500;

    // 4. Azure
    const azureBase = 70;
    const azureCompute = Math.ceil(traffic / 85000) * 27;
    const azureBandwidth = (traffic * 0.0005) * 0.085;
    const azureDisk = (dbStorage * 0.24) + (fileStorage * 0.075);
    const azureTotal = (azureBase + azureCompute + azureBandwidth + azureDisk) * 15500;

    setCloudCosts({
      vps: Math.floor(vpsTotal),
      aws: Math.floor(awsTotal),
      gcp: Math.floor(gcpTotal),
      azure: Math.floor(azureTotal)
    });
  }, [traffic, dbStorage, fileStorage]);

  const getExperienceLevel = (years: number) => {
    if (years <= 2) return { name: 'Junior IT Associate', color: 'text-tertiary' };
    if (years <= 5) return { name: 'Middle Engineer', color: 'text-secondary' };
    if (years <= 9) return { name: 'Senior Specialist', color: 'text-primary' };
    return { name: 'Lead Architect / Principal', color: 'text-error' };
  };

  const expLevel = getExperienceLevel(experience);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background transition-all duration-300">
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-36 pb-12 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Glow auroras */}
        <div className="absolute right-1/4 top-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>
        <div className="absolute left-1/4 bottom-1/4 w-80 h-80 bg-gradient-to-br from-tertiary/10 to-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

        <div className="max-w-4xl px-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-4.5 py-1.5 rounded-full text-xs font-black text-primary uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            Interactive Tools Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-on-surface leading-tight">
            Alat Kalkulator Praktis <span className="brand-gradient-text">Strategi &amp; Karir IT</span>
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed">
            Perkirakan standar gaji industri teknologi di Indonesia secara akurat, atau simulasikan alokasi biaya pengeluaran infrastruktur server cloud Anda secara waktu nyata.
          </p>
        </div>
      </section>

      {/* Tabs Selector Navigation */}
      <section className="w-full max-w-4xl mx-auto px-6 mb-12">
        <div className="p-1.5 rounded-2xl glassmorphism border border-outline-variant/30 grid grid-cols-2 gap-2 shadow-lg">
          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'salary'
                ? 'brand-gradient-bg text-white shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high/40 hover:text-on-surface'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            KALKULATOR GAJI IT INDONESIA
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              activeTab === 'cloud'
                ? 'brand-gradient-bg text-white shadow-md'
                : 'text-on-surface-variant hover:bg-surface-container-high/40 hover:text-on-surface'
            }`}
          >
            <Cloud className="w-4 h-4" />
            ESTIMASI INFRASTRUKTUR CLOUD
          </button>
        </div>
      </section>

      {/* Main Interactive Tool Body */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 pb-24">
        {activeTab === 'salary' ? (
          
          // ====================================================================
          // SALARY ESTIMATOR INTERFACE
          // ====================================================================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Sliders and Inputs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl glassmorphism border border-outline-variant/35 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  Parameter Karir &amp; Kompetensi
                </h3>

                {/* Role Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-secondary" />
                    Peran / Posisi IT
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm font-semibold rounded-2xl p-3 focus:outline-none focus:border-primary shadow-inner"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                      Pengalaman Kerja
                    </label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {experience} Tahun
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-high/45 rounded-lg appearance-none cursor-pointer accent-primary border border-outline-variant/10"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                    <span>Junior (0)</span>
                    <span>Middle (3-5)</span>
                    <span>Senior (6-9)</span>
                    <span>Principal (10+)</span>
                  </div>
                </div>

                {/* Location Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    Lokasi Penempatan
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm font-semibold rounded-2xl p-3 focus:outline-none focus:border-primary shadow-inner"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {/* Skill Stack Checkbox Box */}
                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-primary">
                    Kemampuan Spesifik Tambahan (Stack Bonus)
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {availableSkills.map(sk => {
                      const isSelected = skills.includes(sk.id);
                      return (
                        <button
                          key={sk.id}
                          onClick={() => toggleSkill(sk.id)}
                          className={`p-3 rounded-2xl border text-left text-xs font-extrabold flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? 'bg-primary/10 text-primary border-primary/45 font-black shadow-inner'
                              : 'bg-surface-container-lowest/40 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high/60'
                          }`}
                        >
                          <span>{sk.name}</span>
                          <span className="text-[9px] font-black text-secondary">
                            +{Math.round(sk.bonus * 100)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Estimated Salary Result View */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl glassmorphism border border-outline-variant/35 shadow-xl space-y-6 text-center relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-br from-primary/10 to-tertiary/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
                
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-primary font-sans">
                    Hasil Estimasi Gaji Industri
                  </h4>
                  <p className="text-[10px] text-on-surface-variant">Berdasarkan data karir terkini tahun 2026</p>
                </div>

                {/* Salary Range Card Box */}
                <div className="p-5 rounded-2xl bg-surface-container-lowest/50 border border-outline-variant/20 shadow-inner space-y-2">
                  <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-surface-container-high/50 border border-outline-variant/25 ${expLevel.color}`}>
                    {expLevel.name}
                  </span>
                  
                  <div className="pt-2 text-2xl md:text-3xl font-black text-on-surface tracking-tight leading-none brand-gradient-text">
                    {formatRupiah(estimatedSalary.min)}
                  </div>
                  <div className="text-[10px] font-extrabold text-on-surface-variant/45 uppercase tracking-widest">
                    sampai dengan
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-on-surface tracking-tight leading-none brand-gradient-text pb-1">
                    {formatRupiah(estimatedSalary.max)}
                  </div>
                  
                  <p className="text-[9px] font-bold text-on-surface-variant/60">
                    Rata-rata Gaji Kotor per Bulan (Gross Salary)
                  </p>
                </div>

                {/* Insight Meter Bar */}
                <div className="w-full space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[9px] font-extrabold text-on-surface-variant/70 uppercase tracking-widest">
                    <span>Posisi Gaji</span>
                    <span>Tingkatan: {experience >= 10 ? 'Elite' : experience >= 6 ? 'Senior' : experience >= 3 ? 'Mid' : 'Junior'}</span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-high/50 rounded-full overflow-hidden border border-outline-variant/15 p-0.5">
                    <div 
                      className="h-full brand-gradient-bg rounded-full transition-all duration-700 ease-out shadow-md shadow-primary/20"
                      style={{ width: `${Math.min(100, Math.max(10, (experience / 15) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Strategis Tips based on inputs */}
                <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/15 text-left space-y-2">
                  <h5 className="text-[11px] font-black text-secondary uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-tertiary" />
                    Saran Karir Strategis
                  </h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
                    {experience < 3 ? (
                      'Fokuskan pada penguasaan dasar fundamental algoritma dan satu spesialisasi framework. Keterampilan sistem kontrol versi (Git) dan membangun portfolio riil sangat krusial di tahap awal ini.'
                    ) : experience < 7 ? (
                      'Ini adalah waktu terbaik untuk memperdalam arsitektur sistem berskala besar (System Design) dan mulailah berkontribusi pada keputusan teknis tim. Sertifikasi kompetensi cloud dapat meningkatkan nilai jual Anda hingga 20%.'
                    ) : (
                      'Sebagai talenta ahli, fokus bergeser dari sekadar menulis kode ke arah kepemimpinan arsitektur teknis, mentor tim, serta penyelarasan strategi infrastruktur dengan kebutuhan bisnis utama perusahaan.'
                    )}
                  </p>
                </div>

                <div className="text-[8px] font-bold text-on-surface-variant/45 uppercase tracking-widest text-center">
                  *Gaji bervariasi bergantung pada skala finansial perusahaan &amp; kompleksitas teknis
                </div>
              </div>
            </div>

          </div>
        ) : (
          
          // ====================================================================
          // CLOUD COST ESTIMATOR INTERFACE
          // ====================================================================
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cloud Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl glassmorphism border border-outline-variant/35 shadow-xl space-y-6">
                <h3 className="text-lg font-black text-on-surface flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  Parameter Beban Server (Workload)
                </h3>

                {/* Traffic Visitors Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                      Estimasi Kunjungan Bulanan (Visitors)
                    </label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {traffic.toLocaleString('id-ID')} views
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="50000"
                    value={traffic}
                    onChange={(e) => setTraffic(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-high/45 rounded-lg appearance-none cursor-pointer accent-primary border border-outline-variant/10"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                    <span>Awal (10k)</span>
                    <span>Menengah (1M)</span>
                    <span>Skala Besar (5M+)</span>
                  </div>
                </div>

                {/* Database Storage Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-secondary" />
                      Penyimpanan Database (SQL/NoSQL)
                    </label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {dbStorage} GB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={dbStorage}
                    onChange={(e) => setDbStorage(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-high/45 rounded-lg appearance-none cursor-pointer accent-primary border border-outline-variant/10"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                    <span>5 GB</span>
                    <span>250 GB</span>
                    <span>500 GB</span>
                  </div>
                </div>

                {/* File Assets Storage Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-secondary" />
                      Media Assets &amp; File Storage (Object Store)
                    </label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                      {fileStorage} GB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="2000"
                    step="10"
                    value={fileStorage}
                    onChange={(e) => setFileStorage(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-high/45 rounded-lg appearance-none cursor-pointer accent-primary border border-outline-variant/10"
                  />
                  <div className="flex justify-between text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-widest">
                    <span>10 GB</span>
                    <span>1000 GB (1TB)</span>
                    <span>2000 GB (2TB)</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Cost Comparison Grid Matrix */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl glassmorphism border border-outline-variant/35 shadow-xl space-y-6">
                
                <div>
                  <h4 className="text-base font-black text-on-surface tracking-tight">
                    Komparasi Biaya Infrastruktur Bulanan
                  </h4>
                  <p className="text-[10px] text-on-surface-variant">Estimasi biaya server per bulan dalam Rupiah</p>
                </div>

                {/* Side-by-Side Providers Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Traditional VPS Card */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-inner flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute right-2 top-2 bg-emerald-500/10 text-emerald-500 text-[8px] font-black tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/20">
                      BEST VALUE
                    </div>
                    <div>
                      <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-secondary" />
                        VPS Tradisional
                      </h5>
                      <p className="text-[8px] text-on-surface-variant/60 font-medium">DigitalOcean / Vultr / Linode</p>
                    </div>
                    <div className="pt-4 space-y-1">
                      <div className="text-lg font-black text-on-surface leading-none brand-gradient-text">
                        {formatRupiah(cloudCosts.vps)}
                      </div>
                      <p className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Per Bulan (Estimasi)</p>
                    </div>
                  </div>

                  {/* AWS Cloud Card */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-inner flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-primary" />
                        AWS Enterprise
                      </h5>
                      <p className="text-[8px] text-on-surface-variant/60 font-medium">Amazon Web Services EC2/S3</p>
                    </div>
                    <div className="pt-4 space-y-1">
                      <div className="text-lg font-black text-on-surface leading-none">
                        {formatRupiah(cloudCosts.aws)}
                      </div>
                      <p className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Per Bulan (Estimasi)</p>
                    </div>
                  </div>

                  {/* GCP Cloud Card */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-inner flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-tertiary" />
                        Google Cloud (GCP)
                      </h5>
                      <p className="text-[8px] text-on-surface-variant/60 font-medium">Compute Engine / Cloud Store</p>
                    </div>
                    <div className="pt-4 space-y-1">
                      <div className="text-lg font-black text-on-surface leading-none">
                        {formatRupiah(cloudCosts.gcp)}
                      </div>
                      <p className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Per Bulan (Estimasi)</p>
                    </div>
                  </div>

                  {/* Azure Cloud Card */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-inner flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-error" />
                        Microsoft Azure
                      </h5>
                      <p className="text-[8px] text-on-surface-variant/60 font-medium">Azure VMs / Blob Storage</p>
                    </div>
                    <div className="pt-4 space-y-1">
                      <div className="text-lg font-black text-on-surface leading-none">
                        {formatRupiah(cloudCosts.azure)}
                      </div>
                      <p className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-wider">Per Bulan (Estimasi)</p>
                    </div>
                  </div>
                </div>

                {/* Cloud Architecture Suggestion box */}
                <div className="p-4.5 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                  <h5 className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-tertiary" />
                    Rekomendasi Arsitektur Server
                  </h5>
                  <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
                    {traffic < 200000 ? (
                      'Untuk beban di bawah 200 ribu kunjungan bulanan, menggunakan Virtual Private Server (VPS) mandiri bernilai jauh lebih ekonomis. Gunakan Redis Caching untuk menjamin kecepatan load web Anda.'
                    ) : traffic < 1000000 ? (
                      'Beban menengah sebaiknya menggunakan arsitektur hybrid. Anda bisa meng-host static assets Anda di CDN pihak ketiga seperti Cloudflare untuk menghemat biaya bandwidth keluar yang mahal di cloud besar.'
                    ) : (
                      'Beban skala besar di atas 1 Juta kunjungan membutuhkan orkestrasi cloud murni (AWS/GCP/Azure) yang mendukung Auto-Scaling, Multi-AZ redundansi, serta Load Balancing tingkat tinggi untuk menjamin ketersediaan tinggi (High Availability).'
                    )}
                  </p>
                </div>

                <div className="text-[8px] font-bold text-on-surface-variant/45 uppercase tracking-widest text-center">
                  *Biaya riil dapat bervariasi tergantung pada transfer bandwidth keluar &amp; kebijakan pajak masing-masing penyedia
                </div>

              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
