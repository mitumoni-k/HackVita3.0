

export const difficulties = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for those just starting out',
    icon: 'Sparkles' as keyof typeof import("lucide-react")
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'For developers with some experience',
    icon: 'Zap' as keyof typeof import("lucide-react")
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Challenge yourself with complex problems',
    icon: 'Brain' as keyof typeof import("lucide-react")
  }
];
