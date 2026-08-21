import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CivicBuzz Logo"
                className="w-9 h-9 object-contain rounded-lg bg-white/10 p-0.5"
              />
              <span className="font-extrabold text-base text-white tracking-tight">
                CIVIC<span className="text-emerald-500">BUZZ</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Evidence-Grounded Civic Grievance Triage & Participatory Budgeting Platform. Empowering
              citizens with transparent AI-routed grievance management and democratic project voting.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Government of Odisha & BMC Integrated</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Citizen Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/report-issue" className="hover:text-white transition-colors">
                  Report a Civic Grievance
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Complaint Progress
                </Link>
              </li>
              <li>
                <Link to="/public-issues" className="hover:text-white transition-colors">
                  Public Transparency Feed
                </Link>
              </li>
              <li>
                <Link to="/budgeting" className="hover:text-white transition-colors">
                  Participatory Budgeting & Voting
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="hover:text-white transition-colors">
                  Municipal Tenders & Work Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Municipal Wards Directory */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Key Municipal Zones</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Ward 12: Master Canteen / Janpath</li>
              <li>Ward 30: Saheed Nagar / Rasulgarh</li>
              <li>Ward 5: Patia / Chandrasekharpur</li>
              <li>Ward 24: Khandagiri / Baramunda</li>
              <li>Ward 58: Old Town / Lingaraj Heritage</li>
            </ul>
          </div>

          {/* Col 4: Emergency Helplines */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Emergency Helplines</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold">BMC Toll-Free: 1800-345-0061</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Road Repair Emergency: 1912</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>grievances@civicbuzz.odisha.gov.in</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>BMC Office, Janpath, Bhubaneswar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>© 2026 CivicBuzz Platform. Built for Indian Smart Cities & Public Governance.</span>
          <span className="flex items-center gap-1">
            Grievances Verified on Ground by Citizens <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
