'use client';

import { useState, useTransition } from 'react';
import { saveAttendeeProfile, bookMeeting, respondMeeting } from './actions';

interface Attendee {
  id: string;
  displayName: string;
  title: string | null;
  company: string | null;
  bio: string | null;
  interests: string[];
  photoUrl: string | null;
  social: any;
}

interface Meeting {
  id: string;
  slot: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  roomUrl: string | null;
  notes: string | null;
  aAttendee?: Attendee;
  bAttendee?: Attendee;
}

interface NetworkingPortalProps {
  eventId: string;
  initialProfile: Attendee | null;
  initialAttendees: Attendee[];
  initialMeetings: { sent: Meeting[]; received: Meeting[] };
}

export default function NetworkingPortal({
  eventId,
  initialProfile,
  initialAttendees,
  initialMeetings,
}: NetworkingPortalProps) {
  const [profile, setProfile] = useState<Attendee | null>(initialProfile);
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [activeTab, setActiveTab] = useState<'matchmaking' | 'directory' | 'meetings' | 'profile'>(
    initialProfile ? 'matchmaking' : 'profile'
  );

  const [isPending, startTransition] = useTransition();

  // Profile Form States
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [visibility, setVisibility] = useState<'public' | 'limited' | 'private'>(
    (profile as any)?.visibility || 'public'
  );

  // Meeting Dialog States
  const [schedulingRecipient, setSchedulingRecipient] = useState<Attendee | null>(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    const tag = interestInput.trim().toLowerCase();
    if (!interests.includes(tag)) {
      setInterests([...interests, tag]);
    }
    setInterestInput('');
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests(interests.filter(t => t !== tag));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    startTransition(async () => {
      const res = await saveAttendeeProfile(eventId, {
        displayName,
        title: title || null,
        company: company || null,
        bio: bio || null,
        interests,
        visibility,
      });

      if (res.success) {
        setProfile(res.data as any);
        alert('Profile saved successfully! You can now access matches and schedule meetings.');
        setActiveTab('matchmaking');
      } else {
        alert(res.error || 'Failed to save profile.');
      }
    });
  };

  const handleScheduleMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingRecipient || !meetingDate || !meetingTime) return;

    const slotIso = `${meetingDate}T${meetingTime}:00`;

    startTransition(async () => {
      const res = await bookMeeting(eventId, schedulingRecipient.id, slotIso, meetingNotes);
      if (res.success) {
        alert('Meeting request sent successfully!');
        setMeetings({
          ...meetings,
          sent: [...meetings.sent, res.data as any],
        });
        setSchedulingRecipient(null);
        setMeetingDate('');
        setMeetingTime('');
        setMeetingNotes('');
        setActiveTab('meetings');
      } else {
        alert(res.error || 'Failed to request meeting.');
      }
    });
  };

  const handleRespond = (meetingId: string, status: 'accepted' | 'declined') => {
    startTransition(async () => {
      const res = await respondMeeting(meetingId, eventId, status);
      if (res.success) {
        setMeetings({
          ...meetings,
          received: meetings.received.map(m => (m.id === meetingId ? { ...m, status } : m)),
        });
        alert(`Meeting request ${status}!`);
      } else {
        alert(res.error || 'Failed to update meeting.');
      }
    });
  };

  // AI Matchmaking Logic: Sort attendees by the count of matching interests
  const matches = [...attendees]
    .map(att => {
      const shared = att.interests.filter(i => interests.includes(i));
      return { attendee: att, sharedCount: shared.length, sharedInterests: shared };
    })
    .sort((a, b) => b.sharedCount - a.sharedCount);

  const filteredAttendees = attendees.filter(att => {
    const q = searchQuery.toLowerCase();
    return (
      att.displayName.toLowerCase().includes(q) ||
      (att.company && att.company.toLowerCase().includes(q)) ||
      (att.title && att.title.toLowerCase().includes(q)) ||
      att.interests.some(i => i.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Cover / Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🤝 Attendee Networking Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Connect 1:1, discover shared interests, and attend virtual meetings with other participants.
          </p>
        </div>

        {profile && (
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
              {profile.displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">{profile.displayName}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {profile.title || 'Attendee'} {profile.company ? `@ ${profile.company}` : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-4 scrollbar-none">
        <button
          onClick={() => setActiveTab('matchmaking')}
          disabled={!profile}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            !profile ? 'opacity-40 cursor-not-allowed' : ''
          } ${
            activeTab === 'matchmaking'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          ✨ Suggested Matches (AI)
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          disabled={!profile}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            !profile ? 'opacity-40 cursor-not-allowed' : ''
          } ${
            activeTab === 'directory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          👥 Attendee Directory
        </button>
        <button
          onClick={() => setActiveTab('meetings')}
          disabled={!profile}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            !profile ? 'opacity-40 cursor-not-allowed' : ''
          } ${
            activeTab === 'meetings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          📅 My 1:1 Meetings
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-950'
          }`}
        >
          ⚙️ My Profile Settings
        </button>
      </div>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 gap-6">
        {/* PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="ef-card p-6 max-w-2xl mx-auto w-full">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Edit Networking Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Name *</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Job Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="ef-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Profile Visibility</label>
                  <select
                    value={visibility}
                    onChange={e => setVisibility(e.target.value as any)}
                    className="ef-input text-xs"
                  >
                    <option value="public">Public (Everyone can see you)</option>
                    <option value="limited">Limited (Only matched users)</option>
                    <option value="private">Private (Hidden from networking)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Short Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell others what you are working on and what you'd like to discuss."
                  className="ef-input text-xs min-h-[70px]"
                />
              </div>

              {/* Interests Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Interests & Topics (for Matching)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    placeholder="Add topic (e.g. 'ai', 'saas', 'funding')"
                    className="ef-input text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="ef-btn-secondary px-4 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {interests.length === 0 ? (
                    <span className="text-[10px] text-slate-400">No interest tags added yet. Add tags for better pairing!</span>
                  ) : (
                    interests.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(tag)}
                          className="hover:text-indigo-900 font-extrabold cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="ef-btn-primary w-full py-2.5 text-xs font-bold mt-2"
              >
                {isPending ? 'Saving Profile...' : 'Save and Start Networking'}
              </button>
            </form>
          </div>
        )}

        {/* AI MATCHMAKING */}
        {activeTab === 'matchmaking' && profile && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50 col-span-2">
                  <p className="text-sm font-semibold text-slate-700">No other attendees found</p>
                  <p className="text-xs text-slate-400 mt-1">Check back later once more people join.</p>
                </div>
              ) : (
                matches.map(({ attendee, sharedCount, sharedInterests }) => (
                  <div key={attendee.id} className="ef-card p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center font-black text-indigo-700 text-sm">
                            {attendee.displayName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{attendee.displayName}</h4>
                            <p className="text-xs text-slate-500">
                              {attendee.title} {attendee.company ? `@ ${attendee.company}` : ''}
                            </p>
                          </div>
                        </div>

                        {sharedCount > 0 && (
                          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            ✨ {sharedCount} shared interests
                          </span>
                        )}
                      </div>

                      {attendee.bio && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {attendee.bio}
                        </p>
                      )}

                      {/* Display matched interest tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {attendee.interests.map(tag => {
                          const isMatch = interests.includes(tag);
                          return (
                            <span
                              key={tag}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                isMatch
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                  : 'bg-slate-50 border-slate-100 text-slate-500'
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={() => setSchedulingRecipient(attendee)}
                        className="ef-btn-primary px-4 py-1.5 text-[10px] font-bold"
                      >
                        📅 Schedule 1:1
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ATTENDEE DIRECTORY */}
        {activeTab === 'directory' && profile && (
          <div className="space-y-4">
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search attendees by name, company, job title, or tags..."
                className="ef-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAttendees.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50 col-span-2">
                  <p className="text-sm font-semibold text-slate-700">No attendees match your search</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching with other tags or clear queries.</p>
                </div>
              ) : (
                filteredAttendees.map(attendee => (
                  <div key={attendee.id} className="ef-card p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center font-black text-indigo-700 text-sm">
                          {attendee.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{attendee.displayName}</h4>
                          <p className="text-xs text-slate-500">
                            {attendee.title} {attendee.company ? `@ ${attendee.company}` : ''}
                          </p>
                        </div>
                      </div>

                      {attendee.bio && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {attendee.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 mt-2">
                        {attendee.interests.map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 border-slate-100 text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <button
                        onClick={() => setSchedulingRecipient(attendee)}
                        className="ef-btn-primary px-4 py-1.5 text-[10px] font-bold"
                      >
                        📅 Schedule 1:1
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MEETINGS */}
        {activeTab === 'meetings' && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Received Requests */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Received Requests</h3>
              {meetings.received.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs text-slate-400">No meeting requests received yet.</p>
                </div>
              ) : (
                meetings.received.map(m => (
                  <div key={m.id} className="ef-card p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-xs">
                          {m.aAttendee?.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.aAttendee?.displayName}</p>
                          <p className="text-[10px] text-slate-400">{m.aAttendee?.title} @ {m.aAttendee?.company}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        m.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                        m.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-700">
                      🕒 Time Slot: {new Date(m.slot).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>

                    {m.notes && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] text-slate-500">
                        {m.notes}
                      </div>
                    )}

                    {m.status === 'pending' && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleRespond(m.id, 'accepted')}
                          className="ef-btn-primary px-4 py-1.5 text-[10px] font-bold flex-1"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespond(m.id, 'declined')}
                          className="ef-btn-secondary px-4 py-1.5 text-[10px] font-bold flex-1"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {m.status === 'accepted' && m.roomUrl && (
                      <a
                        href={m.roomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ef-btn-primary w-full py-1.5 text-[10px] font-bold block text-center mt-2 bg-emerald-600 hover:bg-emerald-500"
                      >
                        💻 Join Virtual Meeting
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Sent Requests */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Sent Requests</h3>
              {meetings.sent.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs text-slate-400">No meeting requests sent yet.</p>
                </div>
              ) : (
                meetings.sent.map(m => (
                  <div key={m.id} className="ef-card p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center font-bold text-indigo-700 text-xs">
                          {m.bAttendee?.displayName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{m.bAttendee?.displayName}</p>
                          <p className="text-[10px] text-slate-400">{m.bAttendee?.title} @ {m.bAttendee?.company}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        m.status === 'accepted' ? 'bg-emerald-50 text-emerald-700' :
                        m.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {m.status}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-700">
                      🕒 Time Slot: {new Date(m.slot).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>

                    {m.notes && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] text-slate-500">
                        {m.notes}
                      </div>
                    )}

                    {m.status === 'accepted' && m.roomUrl && (
                      <a
                        href={m.roomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ef-btn-primary w-full py-1.5 text-[10px] font-bold block text-center mt-2 bg-emerald-600 hover:bg-emerald-500"
                      >
                        💻 Join Virtual Meeting
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Dialog Modal */}
      {schedulingRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Request 1:1 Meeting</h3>
              <p className="text-xs text-slate-500 mt-1">
                Select a slot to request a meeting with <span className="font-semibold text-slate-800">{schedulingRecipient.displayName}</span>.
              </p>
            </div>

            <form onSubmit={handleScheduleMeeting} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">Date</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="ef-input text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 block">Time</label>
                  <input
                    type="time"
                    required
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="ef-input text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 block">Introductory Notes (Optional)</label>
                <textarea
                  value={meetingNotes}
                  onChange={e => setMeetingNotes(e.target.value)}
                  placeholder="Tell them why you'd like to connect..."
                  className="ef-input text-xs min-h-[60px]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="ef-btn-primary flex-1 py-2 text-xs font-bold"
                >
                  {isPending ? 'Sending...' : 'Send Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setSchedulingRecipient(null)}
                  className="ef-btn-secondary px-4 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
