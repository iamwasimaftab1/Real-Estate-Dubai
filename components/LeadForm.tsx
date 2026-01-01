
import React, { useState, useEffect } from 'react';
import { LeadData, BudgetRange, PropertyType } from '../types';

interface LeadFormProps {
  onSubmit: (data: LeadData) => void;
  isSubmitting: boolean;
}

interface ValidationErrors {
  email?: string;
  mobile?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<LeadData>({
    email: '',
    mobile: '',
    budget: BudgetRange.MID,
    propertyType: PropertyType.APARTMENT,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Enter a valid professional email";
    return undefined;
  };

  const validateMobile = (mobile: string) => {
    if (!mobile) return "Mobile number is required";
    // UAE Mobile pattern: +971 followed by 9 digits or starting with 05
    const cleanMobile = mobile.replace(/\s+/g, '').replace(/-/g, '');
    const uaeRegex = /^(?:\+971|00971|0)?(?:50|51|52|54|55|56|58|2|3|4|6|7|9)\d{7}$/;
    if (!uaeRegex.test(cleanMobile)) return "Enter a valid UAE mobile (+971...)";
    return undefined;
  };

  useEffect(() => {
    const newErrors: ValidationErrors = {};
    if (touched.email) newErrors.email = validateEmail(formData.email);
    if (touched.mobile) newErrors.mobile = validateMobile(formData.mobile);
    setErrors(newErrors);
  }, [formData.email, formData.mobile, touched]);

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const formatMobile = (value: string) => {
    // Basic auto-formatter for UAE numbers
    let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,4})/);
    if (!x) return value;
    if (value.startsWith('+')) {
        // If they already started with +, preserve it
        return !x[2] ? `+${x[1]}` : `+${x[1]} ${x[2]} ${x[3]} ${x[4]}`.trim();
    }
    // If they start with 971, add the +
    if (value.startsWith('971')) {
        return !x[2] ? `+${x[1]}` : `+${x[1]} ${x[2]} ${x[3]} ${x[4]}`.trim();
    }
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(formData.email);
    const mobileErr = validateMobile(formData.mobile);

    if (emailErr || mobileErr) {
      setErrors({ email: emailErr, mobile: mobileErr });
      setTouched({ email: true, mobile: true });
      return;
    }
    onSubmit(formData);
  };

  const isFormValid = !validateEmail(formData.email) && !validateMobile(formData.mobile);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full transition-all duration-300">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Elite Investment Access</h3>
        <p className="text-slate-500 text-xs">Fast-track your UAE property portfolio</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
            <span>Property Type</span>
            {formData.propertyType && <span className="text-amber-600 font-black">Selection Active</span>}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PropertyType).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, propertyType: type })}
                className={`text-[10px] py-2.5 px-1 rounded-lg border transition-all font-semibold ${
                  formData.propertyType === type 
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md scale-[1.02]' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
              <span>Email Address</span>
              {touched.email && !errors.email && <span className="text-green-500">✓ Valid</span>}
            </label>
            <input
              required
              type="email"
              placeholder="investor@realtyuae.ae"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all text-sm ${
                errors.email 
                  ? 'border-red-400 ring-1 ring-red-100' 
                  : touched.email && !errors.email 
                    ? 'border-green-400' 
                    : 'border-slate-200 focus:ring-2 focus:ring-amber-500'
              }`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            />
            {errors.email && (
              <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-tighter animate-fadeIn">
                {errors.email}
              </p>
            )}
          </div>
          
          <div className="relative pt-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
              <span>Mobile Number</span>
              {touched.mobile && !errors.mobile && <span className="text-green-500">✓ Valid</span>}
            </label>
            <input
              required
              type="tel"
              placeholder="+971 5X XXX XXXX"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all text-sm ${
                errors.mobile 
                  ? 'border-red-400 ring-1 ring-red-100' 
                  : touched.mobile && !errors.mobile 
                    ? 'border-green-400' 
                    : 'border-slate-200 focus:ring-2 focus:ring-amber-500'
              }`}
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', formatMobile(e.target.value))}
              onBlur={() => setTouched(prev => ({ ...prev, mobile: true }))}
            />
            {errors.mobile && (
              <p className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-tighter animate-fadeIn">
                {errors.mobile}
              </p>
            )}
          </div>

          <div className="pt-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Investment Budget</label>
            <div className="relative">
                <select
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all appearance-none cursor-pointer text-sm font-medium"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                >
                {Object.values(BudgetRange).map((range) => (
                    <option key={range} value={range}>{range}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      <button
        disabled={isSubmitting || (Object.keys(errors).length > 0 && (touched.email || touched.mobile))}
        type="submit"
        className={`w-full mt-10 text-white font-bold py-4 rounded-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${
            isSubmitting || !isFormValid
            ? 'bg-slate-300 cursor-not-allowed'
            : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Securing Strategy...
          </>
        ) : (
          <>
            GET INVESTMENT STRATEGY
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l7-7m-7 7H3" />
            </svg>
          </>
        )}
      </button>

      <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-100 pt-6">
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
            ))}
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Joined by 2,400+ Investors this month
        </p>
      </div>
    </form>
  );
};

export default LeadForm;
