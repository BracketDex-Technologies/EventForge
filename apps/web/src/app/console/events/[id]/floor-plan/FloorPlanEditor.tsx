'use client';

import { useState, useTransition } from 'react';
import { saveFloorPlan } from './actions';

interface Booth {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  exhibitorId: string;
}

interface FloorPlanEditorProps {
  eventId: string;
  initialFloorPlan: {
    id: string | null;
    name: string;
    bgImageUrl: string | null;
    layout: {
      width: number;
      height: number;
      booths: Booth[];
    };
  };
  exhibitors: Array<{ id: string; name: string }>;
}

export default function FloorPlanEditor({ eventId, initialFloorPlan, exhibitors }: FloorPlanEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialFloorPlan.name);
  const [layout, setLayout] = useState(initialFloorPlan.layout);
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(initialFloorPlan.layout.booths[0]?.id || null);

  const selectedBooth = layout.booths.find(b => b.id === selectedBoothId);

  const updateBoothProperty = (boothId: string, key: keyof Booth, value: any) => {
    setLayout({
      ...layout,
      booths: layout.booths.map(b => b.id === boothId ? { ...b, [key]: value } : b)
    });
  };

  const addBooth = () => {
    const newId = `booth_${Date.now()}`;
    const newBooth: Booth = {
      id: newId,
      x: 100,
      y: 100,
      w: 80,
      h: 80,
      label: `Booth ${layout.booths.length + 101}`,
      exhibitorId: '',
    };

    setLayout({
      ...layout,
      booths: [...layout.booths, newBooth]
    });
    setSelectedBoothId(newId);
  };

  const deleteBooth = (boothId: string) => {
    const remaining = layout.booths.filter(b => b.id !== boothId);
    setLayout({ ...layout, booths: remaining });
    setSelectedBoothId(remaining[0]?.id || null);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveFloorPlan(eventId, initialFloorPlan.id, {
        name,
        bgImageUrl: initialFloorPlan.bgImageUrl,
        layout,
      });

      if (res.success) {
        alert('Floor plan saved successfully!');
      } else {
        alert(res.error || 'Failed to save floor plan.');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor sidebar controls - 4 cols */}
      <div className="lg:col-span-4 space-y-6">
        <div className="ef-card p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Hall Settings</h3>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="ef-btn-primary px-4 py-1.5 text-xs font-bold"
            >
              {isPending ? 'Saving...' : 'Save Plan'}
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Floor Plan Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="ef-input text-xs"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Grid Width (px)</label>
                <input
                  type="number"
                  value={layout.width}
                  onChange={e => setLayout({ ...layout, width: parseInt(e.target.value) || 600 })}
                  className="ef-input text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Grid Height (px)</label>
                <input
                  type="number"
                  value={layout.height}
                  onChange={e => setLayout({ ...layout, height: parseInt(e.target.value) || 400 })}
                  className="ef-input text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={addBooth}
              className="ef-btn-secondary w-full text-xs font-bold py-2"
            >
              + Place New Booth
            </button>
          </div>
        </div>

        {/* Selected Booth Editor Properties */}
        {selectedBooth && (
          <div className="ef-card p-5 space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="text-xs font-bold text-slate-900">
                Booth Details: {selectedBooth.label}
              </h4>
              <button
                type="button"
                onClick={() => deleteBooth(selectedBooth.id)}
                className="text-xs font-bold text-rose-500 hover:text-rose-700"
              >
                Delete
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Booth Name / Label</label>
                <input
                  type="text"
                  value={selectedBooth.label}
                  onChange={e => updateBoothProperty(selectedBooth.id, 'label', e.target.value)}
                  className="ef-input text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assign Exhibitor</label>
                <select
                  value={selectedBooth.exhibitorId}
                  onChange={e => updateBoothProperty(selectedBooth.id, 'exhibitorId', e.target.value)}
                  className="ef-input text-xs"
                >
                  <option value="">-- No Exhibitor Assigned --</option>
                  {exhibitors.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Position X (px)</label>
                  <input
                    type="number"
                    value={selectedBooth.x}
                    onChange={e => updateBoothProperty(selectedBooth.id, 'x', parseInt(e.target.value) || 0)}
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Position Y (px)</label>
                  <input
                    type="number"
                    value={selectedBooth.y}
                    onChange={e => updateBoothProperty(selectedBooth.id, 'y', parseInt(e.target.value) || 0)}
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Width (px)</label>
                  <input
                    type="number"
                    value={selectedBooth.w}
                    onChange={e => updateBoothProperty(selectedBooth.id, 'w', parseInt(e.target.value) || 40)}
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Height (px)</label>
                  <input
                    type="number"
                    value={selectedBooth.h}
                    onChange={e => updateBoothProperty(selectedBooth.id, 'h', parseInt(e.target.value) || 40)}
                    className="ef-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas view panel - 8 cols */}
      <div className="lg:col-span-8">
        <div className="ef-card p-6 overflow-auto bg-slate-900 border-slate-950 flex justify-center items-center select-none min-h-[500px]">
          {/* Main layout container representing Grid floor */}
          <div
            className="border-2 border-dashed border-indigo-500/20 bg-slate-950 relative shadow-2xl rounded-xl transition-all"
            style={{
              width: `${layout.width}px`,
              height: `${layout.height}px`,
            }}
          >
            {/* Draw Grid Background Lines */}
            <div className="absolute inset-0 ef-dot-pattern opacity-10 pointer-events-none" />

            {/* Draw booths */}
            {layout.booths.map((booth) => {
              const isSelected = selectedBoothId === booth.id;
              const exhibitor = exhibitors.find(e => e.id === booth.exhibitorId);

              return (
                <div
                  key={booth.id}
                  onClick={() => setSelectedBoothId(booth.id)}
                  style={{
                    left: `${booth.x}px`,
                    top: `${booth.y}px`,
                    width: `${booth.w}px`,
                    height: `${booth.h}px`,
                  }}
                  className={`absolute rounded-lg border-2 flex flex-col items-center justify-center p-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200 ring-2 ring-indigo-500/50 shadow-lg'
                      : booth.exhibitorId
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <p className="text-[10px] font-black tracking-tight leading-none">{booth.label}</p>
                  
                  {exhibitor ? (
                    <p className="text-[8px] font-bold mt-1 text-emerald-400 line-clamp-1 max-w-[90%]">
                      {exhibitor.name}
                    </p>
                  ) : (
                    <span className="text-[7px] text-slate-500 font-semibold mt-1">Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
