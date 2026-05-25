export type Tip = {
  id: string;
  category: 'awareness' | 'escape' | 'tools';
  title: string;
  body: string;
};

export const Tips: Tip[] = [
  {
    id: '1',
    category: 'awareness',
    title: 'Trust your instincts',
    body: 'If something feels wrong, leave the area immediately. Your gut is your best early warning system — never second-guess it.',
  },
  {
    id: '2',
    category: 'escape',
    title: 'Know your exits',
    body: 'When entering any venue or transport hub, identify at least two exit routes before you need them.',
  },
  {
    id: '3',
    category: 'tools',
    title: 'Personal safety alarm',
    body: 'A 120dB personal alarm is legal, cheap, and highly effective at deterring threats and attracting attention.',
  },
  {
    id: '4',
    category: 'awareness',
    title: 'Stay off your phone in crowds',
    body: 'Keep your head up, especially at night, at transport stops, and near ATMs. Distracted people are easier targets.',
  },
  {
    id: '5',
    category: 'escape',
    title: 'Tell someone your plans',
    body: 'Let a trusted person know where you are going and when you expect to be back, especially at night.',
  },
  {
    id: '6',
    category: 'tools',
    title: 'Keep your phone charged',
    body: 'A dead phone in an emergency is dangerous. Carry a small power bank if you are out for long periods.',
  },
  {
    id: '7',
    category: 'awareness',
    title: 'Walk confidently',
    body: 'Walk with purpose and make brief eye contact. Confident body language makes you a less appealing target.',
  },
  {
    id: '8',
    category: 'escape',
    title: 'Stay in well-lit areas',
    body: 'At night, stick to busy, well-lit streets. Avoid shortcuts through parks, laneways, or isolated areas.',
  },
];