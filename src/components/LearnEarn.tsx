import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Coins, 
  Star,
  CheckCircle,
  Lock,
  Trophy,
  Zap,
  Target
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  reward: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  locked: boolean;
  progress: number;
  modules: number;
}

const courses: Course[] = [
  {
    id: 'crypto-basics',
    title: 'Cryptocurrency Fundamentals',
    description: 'Learn the basics of blockchain technology and digital currencies',
    duration: '45 min',
    reward: 50,
    difficulty: 'Beginner',
    completed: true,
    locked: false,
    progress: 100,
    modules: 6
  },
  {
    id: 'wallet-security',
    title: 'Wallet Security Best Practices',
    description: 'Secure your crypto assets with proper wallet management',
    duration: '30 min',
    reward: 40,
    difficulty: 'Beginner',
    completed: true,
    locked: false,
    progress: 100,
    modules: 4
  },
  {
    id: 'trading-basics',
    title: 'Trading 101: Getting Started',
    description: 'Introduction to cryptocurrency trading and market analysis',
    duration: '60 min',
    reward: 75,
    difficulty: 'Intermediate',
    completed: false,
    locked: false,
    progress: 67,
    modules: 8
  },
  {
    id: 'defi-fundamentals',
    title: 'DeFi Fundamentals',
    description: 'Explore decentralized finance protocols and yield farming',
    duration: '90 min',
    reward: 100,
    difficulty: 'Intermediate',
    completed: false,
    locked: false,
    progress: 0,
    modules: 10
  },
  {
    id: 'nft-creation',
    title: 'NFT Creation & Trading',
    description: 'Create, mint, and trade non-fungible tokens',
    duration: '75 min',
    reward: 80,
    difficulty: 'Intermediate',
    completed: false,
    locked: true,
    progress: 0,
    modules: 7
  },
  {
    id: 'advanced-trading',
    title: 'Advanced Trading Strategies',
    description: 'Master complex trading techniques and risk management',
    duration: '120 min',
    reward: 150,
    difficulty: 'Advanced',
    completed: false,
    locked: true,
    progress: 0,
    modules: 12
  }
];

const LearnEarn = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [totalEarned, setTotalEarned] = useState(90); // Already earned from completed courses

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success';
      case 'Intermediate': return 'text-warning';
      case 'Advanced': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/20 text-success border-success/30';
      case 'Intermediate': return 'bg-warning/20 text-warning border-warning/30';
      case 'Advanced': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const startCourse = (course: Course) => {
    if (!course.locked) {
      setSelectedCourse(course);
    }
  };

  const completedCourses = courses.filter(course => course.completed).length;
  const totalCourses = courses.length;
  const completionPercentage = (completedCourses / totalCourses) * 100;

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCourse(null)}
            className="glow-border"
          >
            ← Back to Courses
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
            <p className="text-muted-foreground">{selectedCourse.description}</p>
          </div>
        </div>

        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="text-crypto-glow" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-secondary/50 rounded-lg glow-border">
                <Clock className="w-8 h-8 mx-auto mb-2 text-crypto-glow" />
                <div className="font-semibold">{selectedCourse.duration}</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg glow-border">
                <Coins className="w-8 h-8 mx-auto mb-2 text-warning" />
                <div className="font-semibold">{selectedCourse.reward} Points</div>
                <div className="text-sm text-muted-foreground">Reward</div>
              </div>
              <div className="text-center p-4 bg-secondary/50 rounded-lg glow-border">
                <Target className="w-8 h-8 mx-auto mb-2 text-crypto-neon-green" />
                <div className="font-semibold">{selectedCourse.modules} Modules</div>
                <div className="text-sm text-muted-foreground">Content</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Progress</span>
                <span>{selectedCourse.progress}%</span>
              </div>
              <Progress value={selectedCourse.progress} className="h-3" />
            </div>

            {/* Module List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Course Modules</h3>
              {Array.from({ length: selectedCourse.modules }, (_, index) => {
                const isCompleted = index < Math.floor((selectedCourse.progress / 100) * selectedCourse.modules);
                const isCurrent = index === Math.floor((selectedCourse.progress / 100) * selectedCourse.modules);
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isCompleted 
                        ? 'border-success bg-success/10' 
                        : isCurrent 
                        ? 'border-crypto-glow bg-crypto-glow/10 glow-border' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-success text-success-foreground' 
                        : isCurrent 
                        ? 'bg-crypto-glow text-crypto-glow-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Module {index + 1}: {getModuleName(selectedCourse.id, index)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Locked'}
                      </div>
                    </div>
                    {isCurrent && (
                      <Button size="sm" className="glow-border">
                        Continue
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold crypto-gradient bg-clip-text text-transparent">
          Learn & Earn
        </h2>
        <p className="text-muted-foreground text-lg">
          Master crypto concepts and earn rewards for your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-warning" />
            <div className="text-2xl font-bold text-warning">{totalEarned}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </CardContent>
        </Card>
        
        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-crypto-glow" />
            <div className="text-2xl font-bold text-crypto-glow">{completedCourses}</div>
            <div className="text-sm text-muted-foreground">Courses Completed</div>
          </CardContent>
        </Card>
        
        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 text-crypto-neon-green" />
            <div className="text-2xl font-bold text-crypto-neon-green">{completionPercentage.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className={`cursor-pointer transition-all duration-300 ${
              course.locked 
                ? 'opacity-50 border-border' 
                : course.completed 
                ? 'glow-border border-success' 
                : 'glow-border hover:neon-glow'
            }`}
            onClick={() => !course.locked && startCourse(course)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {course.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : course.locked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Play className="w-5 h-5 text-crypto-glow" />
                    )}
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {course.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getDifficultyBadge(course.difficulty)}>
                  {course.difficulty}
                </Badge>
                <Badge variant="secondary" className="glow-border">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.duration}
                </Badge>
                <Badge variant="secondary" className="glow-border">
                  <Coins className="w-3 h-3 mr-1" />
                  {course.reward} pts
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {!course.locked && course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
              
              <Button 
                variant={course.completed ? "secondary" : "outline"} 
                className="w-full glow-border"
                disabled={course.locked}
              >
                {course.locked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Previous Courses
                  </>
                ) : course.completed ? (
                  <>
                    <Trophy className="w-4 h-4 mr-2" />
                    Review Course
                  </>
                ) : course.progress > 0 ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Course
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to generate module names
const getModuleName = (courseId: string, moduleIndex: number): string => {
  const moduleNames: Record<string, string[]> = {
    'crypto-basics': [
      'What is Cryptocurrency?',
      'Blockchain Technology',
      'Types of Cryptocurrencies',
      'How Mining Works',
      'Digital Wallets',
      'Security Fundamentals'
    ],
    'wallet-security': [
      'Wallet Types Overview',
      'Private Key Management',
      'Two-Factor Authentication',
      'Backup Strategies'
    ],
    'trading-basics': [
      'Market Analysis',
      'Order Types',
      'Risk Management',
      'Technical Indicators',
      'Portfolio Diversification',
      'Trading Psychology',
      'Exchange Selection',
      'Tax Implications'
    ],
    'defi-fundamentals': [
      'DeFi Overview',
      'Liquidity Pools',
      'Yield Farming',
      'Decentralized Exchanges',
      'Lending Protocols',
      'Governance Tokens',
      'Risk Assessment',
      'Smart Contracts',
      'DeFi Security',
      'Future of DeFi'
    ],
    'nft-creation': [
      'NFT Basics',
      'Creating Digital Art',
      'Minting Process',
      'Marketplace Selection',
      'Pricing Strategies',
      'Community Building',
      'Legal Considerations'
    ],
    'advanced-trading': [
      'Advanced Technical Analysis',
      'Algorithmic Trading',
      'Derivatives Trading',
      'Arbitrage Opportunities',
      'Market Making',
      'Risk Models',
      'Portfolio Theory',
      'Quantitative Analysis',
      'Trading Bots',
      'Regulatory Compliance',
      'Professional Tools',
      'Performance Metrics'
    ]
  };
  
  return moduleNames[courseId]?.[moduleIndex] || `Module ${moduleIndex + 1}`;
};

export default LearnEarn;