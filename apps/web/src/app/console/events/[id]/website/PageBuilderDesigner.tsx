'use client';

import { useState, useTransition } from 'react';
import { savePageDraft, publishPage } from './actions';

interface Block {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
  customHtml?: string;
  questions?: Array<{ q: string; a: string }>;
}

interface PageBuilderDesignerProps {
  eventId: string;
  initialBlocks: Block[];
  isPublished: boolean;
}

export default function PageBuilderDesigner({ eventId, initialBlocks, isPublished }: PageBuilderDesignerProps) {
  const [isPending, startTransition] = useTransition();
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(initialBlocks[0]?.id || null);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const updateBlockProperty = (id: string, key: keyof Block, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const addBlock = (type: string) => {
    const newId = `${type.toLowerCase()}_${Date.now()}`;
    const newBlock: Block = {
      id: newId,
      type,
      title: `New ${type} Block`,
      subtitle: 'Change this text in the editor.',
      bgColor: type === 'Hero' ? '#3b82f6' : '#ffffff',
      textColor: '#ffffff',
      buttonText: 'Click Here',
      customHtml: '<div class="p-8 text-center bg-slate-100 rounded-xl">Custom HTML Content</div>',
      questions: [{ q: 'Question 1?', a: 'Answer 1.' }],
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newId);
  };

  const deleteBlock = (id: string) => {
    const remaining = blocks.filter(b => b.id !== id);
    setBlocks(remaining);
    setSelectedBlockId(remaining[0]?.id || null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const handleSaveDraft = () => {
    startTransition(async () => {
      const res = await savePageDraft(eventId, 'index', blocks);
      if (res.success) {
        alert('Draft saved successfully!');
      } else {
        alert(res.error || 'Failed to save draft.');
      }
    });
  };

  const handlePublish = () => {
    startTransition(async () => {
      // First save draft, then publish
      const saveRes = await savePageDraft(eventId, 'index', blocks);
      if (!saveRes.success) {
        alert('Failed to save draft before publishing.');
        return;
      }

      const res = await publishPage(eventId, 'index');
      if (res.success) {
        alert('Website published successfully! Changes are now live on the public landing page.');
      } else {
        alert(res.error || 'Failed to publish website.');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor & Sidebar controls - 5 cols */}
      <div className="lg:col-span-5 space-y-6">
        <div className="ef-card p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Blocks Hierarchy</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                disabled={isPending}
                className="ef-btn-secondary px-3 py-1.5 text-xs font-bold"
              >
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={isPending}
                className="ef-btn-primary px-3 py-1.5 text-xs font-bold"
              >
                Publish Live
              </button>
            </div>
          </div>

          {/* Block list */}
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                onClick={() => setSelectedBlockId(block.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  selectedBlockId === block.id
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">{block.title}</p>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{block.type}</span>
                </div>
                
                <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                  <button
                    disabled={index === 0}
                    onClick={() => moveBlock(index, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs font-bold"
                  >
                    ▲
                  </button>
                  <button
                    disabled={index === blocks.length - 1}
                    onClick={() => moveBlock(index, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 text-xs font-bold"
                  >
                    ▼
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-1 text-rose-400 hover:text-rose-600 text-xs font-bold ml-1"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Add New Block</p>
            <div className="flex flex-wrap gap-1.5">
              {['Hero', 'Speakers', 'Agenda', 'FAQ', 'HTML'].map((type) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  + {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Block Editor Properties */}
        {selectedBlock && (
          <div className="ef-card p-5 space-y-4 animate-fade-in">
            <h4 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
              Block Settings: {selectedBlock.type}
            </h4>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Block Title</label>
                <input
                  type="text"
                  value={selectedBlock.title}
                  onChange={e => updateBlockProperty(selectedBlock.id, 'title', e.target.value)}
                  className="ef-input text-xs"
                />
              </div>

              {selectedBlock.type !== 'HTML' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Subtitle / Description</label>
                  <textarea
                    value={selectedBlock.subtitle || ''}
                    onChange={e => updateBlockProperty(selectedBlock.id, 'subtitle', e.target.value)}
                    className="ef-input text-xs min-h-[60px]"
                  />
                </div>
              )}

              {selectedBlock.type === 'Hero' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Background Color</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={selectedBlock.bgColor || '#1e293b'}
                          onChange={e => updateBlockProperty(selectedBlock.id, 'bgColor', e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedBlock.bgColor || '#1e293b'}
                          onChange={e => updateBlockProperty(selectedBlock.id, 'bgColor', e.target.value)}
                          className="ef-input text-xs py-1 px-2"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Text Color</label>
                      <div className="flex gap-1.5">
                        <input
                          type="color"
                          value={selectedBlock.textColor || '#ffffff'}
                          onChange={e => updateBlockProperty(selectedBlock.id, 'textColor', e.target.value)}
                          className="w-8 h-8 rounded border cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedBlock.textColor || '#ffffff'}
                          onChange={e => updateBlockProperty(selectedBlock.id, 'textColor', e.target.value)}
                          className="ef-input text-xs py-1 px-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Button CTA Text</label>
                    <input
                      type="text"
                      value={selectedBlock.buttonText || 'Register'}
                      onChange={e => updateBlockProperty(selectedBlock.id, 'buttonText', e.target.value)}
                      className="ef-input text-xs"
                    />
                  </div>
                </>
              )}

              {selectedBlock.type === 'HTML' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Custom HTML Code</label>
                  <textarea
                    value={selectedBlock.customHtml || ''}
                    onChange={e => updateBlockProperty(selectedBlock.id, 'customHtml', e.target.value)}
                    className="ef-input font-mono text-[10px] min-h-[140px]"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Visual live layout preview simulation - 7 cols */}
      <div className="lg:col-span-7 space-y-4">
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-md">
          {/* Header toolbar simulating browser */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            
            <div className="bg-white/80 dark:bg-slate-900/80 px-8 py-1 rounded-lg text-[10px] text-slate-500 font-mono select-none w-1/2 text-center border border-slate-200/50">
              localhost:3000/e/{eventId}
            </div>

            <span className="text-xs text-slate-400 select-none">Web Layout</span>
          </div>

          {/* Visual simulation content */}
          <div className="bg-slate-50 max-h-[500px] overflow-y-auto divide-y divide-slate-100">
            {blocks.map((block) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`relative group transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-indigo-500 ring-inset' : 'hover:outline hover:outline-dashed hover:outline-2 hover:outline-indigo-300'
                  }`}
                >
                  {/* Visual Renderers based on type */}
                  {block.type === 'Hero' && (
                    <div
                      className="py-12 px-6 text-center space-y-3"
                      style={{ backgroundColor: block.bgColor, color: block.textColor }}
                    >
                      <h4 className="text-lg md:text-xl font-black">{block.title}</h4>
                      <p className="text-xs opacity-80 max-w-md mx-auto">{block.subtitle}</p>
                      {block.buttonText && (
                        <button type="button" className="px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold shadow-sm">
                          {block.buttonText}
                        </button>
                      )}
                    </div>
                  )}

                  {block.type === 'Speakers' && (
                    <div className="py-8 px-6 bg-white text-center space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{block.subtitle}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="p-3 border border-slate-100 rounded-xl space-y-1 bg-slate-50/50">
                            <div className="w-8 h-8 rounded-full bg-slate-200 mx-auto" />
                            <p className="text-[10px] font-bold text-slate-800">Speaker Name {n}</p>
                            <p className="text-[8px] text-slate-400">Speaker Title</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'Agenda' && (
                    <div className="py-8 px-6 bg-slate-50 text-center space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{block.subtitle}</p>
                      </div>
                      <div className="space-y-2 max-w-md mx-auto text-left">
                        {[1, 2].map((n) => (
                          <div key={n} className="p-3 bg-white border border-slate-200/50 rounded-xl flex gap-3 items-center">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">10:00 AM</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-800">Keynote Presentation {n}</p>
                              <p className="text-[8px] text-slate-400">Track 1 • Room A</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'FAQ' && (
                    <div className="py-8 px-6 bg-white space-y-4">
                      <div className="text-center">
                        <h4 className="text-sm font-bold text-slate-900">{block.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{block.subtitle}</p>
                      </div>
                      <div className="max-w-md mx-auto space-y-2 text-left">
                        {(block.questions || []).map((faq, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-800">{faq.q}</p>
                            <p className="text-[9px] text-slate-500 mt-1">{faq.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {block.type === 'HTML' && (
                    <div className="p-4 bg-white">
                      <div dangerouslySetInnerHTML={{ __html: block.customHtml || '' }} />
                    </div>
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
