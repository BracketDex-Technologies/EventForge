'use client';

import { useState, useTransition } from 'react';
import { saveCertificateTemplate } from './actions';

interface TemplateDesignerFormProps {
  eventId: string;
  initialTemplate: {
    id: string | null;
    name: string;
    style: string;
    layout: {
      title: string;
      subtitle: string;
      footerText: string;
      signatoryName: string;
      signatoryTitle: string;
    };
    isDefault: boolean;
  };
}

export default function TemplateDesignerForm({ eventId, initialTemplate }: TemplateDesignerFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialTemplate.name);
  const [style, setStyle] = useState(initialTemplate.style);
  const [isDefault, setIsDefault] = useState(initialTemplate.isDefault);

  // Layout states
  const [title, setTitle] = useState(initialTemplate.layout.title || 'Certificate of Attendance');
  const [subtitle, setSubtitle] = useState(initialTemplate.layout.subtitle || 'This is proudly presented to');
  const [footerText, setFooterText] = useState(initialTemplate.layout.footerText || 'For active participation in the event.');
  const [signatoryName, setSignatoryName] = useState(initialTemplate.layout.signatoryName || 'Event Organizer');
  const [signatoryTitle, setSignatoryTitle] = useState(initialTemplate.layout.signatoryTitle || 'Host');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveCertificateTemplate(eventId, initialTemplate.id, {
        name,
        style,
        isDefault,
        layout: {
          title,
          subtitle,
          footerText,
          signatoryName,
          signatoryTitle,
        },
      });

      if (res.success) {
        alert('Certificate template saved successfully!');
      } else {
        alert(res.error || 'Failed to save certificate template.');
      }
    });
  };

  // Certificate Mock Preview Helper
  const getStyleClasses = () => {
    switch (style) {
      case 'modern':
        return {
          border: 'border-[8px] border-double border-indigo-600',
          bg: 'bg-indigo-50/20',
          titleFont: 'font-sans font-black text-indigo-700 tracking-wider uppercase',
          nameFont: 'font-sans font-bold text-slate-800 text-base underline decoration-indigo-500 decoration-2 underline-offset-4',
        };
      case 'elegant':
        return {
          border: 'border-[6px] border-amber-600 outline outline-offset-4 outline-1 outline-amber-600/30',
          bg: 'bg-amber-50/10',
          titleFont: 'font-serif italic text-amber-800',
          nameFont: 'font-serif italic font-bold text-slate-850 text-base border-b border-amber-600/30 pb-0.5 inline-block',
        };
      case 'minimal':
        return {
          border: 'border border-slate-300',
          bg: 'bg-white',
          titleFont: 'font-sans font-medium text-slate-900 tracking-widest uppercase',
          nameFont: 'font-sans font-semibold text-slate-800 text-sm bg-slate-50 px-4 py-1 rounded border border-slate-100',
        };
      default: // classic
        return {
          border: 'border-[12px] border-slate-900 double',
          bg: 'bg-slate-50/30',
          titleFont: 'font-serif font-extrabold text-slate-900 uppercase',
          nameFont: 'font-serif font-bold text-slate-850 text-base',
        };
    }
  };

  const preview = getStyleClasses();

  return (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
          <span>Live Template Preview</span>
          <span className="capitalize">{style} Style</span>
        </div>
        <div className="p-4 bg-white flex justify-center items-center">
          {/* Certificate design box */}
          <div className={`w-full max-w-sm aspect-[4/3] ${preview.bg} ${preview.border} p-4 text-center flex flex-col justify-between select-none`}>
            <div className="space-y-1">
              <h5 className={`text-xs ${preview.titleFont} text-[10px]`}>{title}</h5>
              <p className="text-[8px] text-slate-400 italic mt-0.5">{subtitle}</p>
            </div>
            
            <div className="my-2">
              <span className={preview.nameFont}>[Attendee Name]</span>
            </div>

            <div className="space-y-2">
              <p className="text-[7px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">{footerText}</p>
              
              <div className="flex justify-between items-end px-4 pt-1 border-t border-slate-100/50 mt-1">
                <div className="text-left">
                  <p className="text-[8px] font-bold text-slate-800">{signatoryName}</p>
                  <p className="text-[6px] text-slate-400">{signatoryTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[6px] text-slate-400">Verification Code</p>
                  <p className="text-[7px] font-mono font-bold text-slate-800">ABC123XY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Template Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="ef-input text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Certificate Style</label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="ef-input text-xs"
            >
              <option value="classic">Classic Border</option>
              <option value="modern">Modern Indigo</option>
              <option value="elegant">Elegant Amber</option>
              <option value="minimal">Minimalist Gray</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Default Template</label>
            <select
              value={isDefault ? 'true' : 'false'}
              onChange={e => setIsDefault(e.target.value === 'true')}
              className="ef-input text-xs"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-2" />

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Main Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="ef-input text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Presentation Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="ef-input text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Footer description / participation text</label>
          <textarea
            value={footerText}
            onChange={e => setFooterText(e.target.value)}
            className="ef-input text-xs min-h-[50px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Signatory Name</label>
            <input
              type="text"
              value={signatoryName}
              onChange={e => setSignatoryName(e.target.value)}
              className="ef-input text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Signatory Title</label>
            <input
              type="text"
              value={signatoryTitle}
              onChange={e => setSignatoryTitle(e.target.value)}
              className="ef-input text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="ef-btn-primary w-full py-2.5 text-xs font-bold"
        >
          {isPending ? 'Saving Template...' : 'Save Template'}
        </button>
      </form>
    </div>
  );
}
