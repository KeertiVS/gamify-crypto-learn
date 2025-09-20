import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bitcoin, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Gamepad2, 
  Coins,
  ArrowRight,
  Star,
  Zap,
  Target
} from 'lucide-react';

interface CryptoDashboardProps {
  onNavigate: (page: string) => void;
}

interface UserStats {
  level: number;
  points: number;
  badges: number;
  coursesCompleted: number;
  totalCourses: number;
}

const CryptoDashboard = ({ onNavigate }: CryptoDashboardProps) => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 3,
    points: 1250,
    badges: 8,
    coursesCompleted: 4,
    totalCourses: 12,
  });

  const [bitcoinPosition, setBitcoinPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinPosition(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const completionPercentage = (userStats.coursesCompleted / userStats.totalCourses) * 100;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold crypto-gradient bg-clip-text text-transparent animate-neon-glow">
          Quest Crypto Hub
        </h1>
        <p className="text-muted-foreground text-lg">
          Master crypto through gamified learning
        </p>
      </div>

      {/* Bitcoin Transaction Animation */}
      <Card className="glow-border card-gradient overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-crypto-glow">
            <Bitcoin className="animate-coin-flip" />
            Live Transaction Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="relative h-32">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
            <div className="w-12 h-12 rounded-full bg-success/20 border-2 border-success flex items-center justify-center">
              <span className="text-xs font-bold">YOU</span>
            </div>
          </div>
          
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
            <div className="w-12 h-12 rounded-full bg-crypto-glow/20 border-2 border-crypto-glow flex items-center justify-center">
              <span className="text-xs font-bold">RECV</span>
            </div>
          </div>

          {/* Animated Bitcoin */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-100"
            style={{ left: `${bitcoinPosition}%` }}
          >
            <Bitcoin className="w-8 h-8 text-primary animate-float bitcoin-glow" />
          </div>

          {/* Transaction Path */}
          <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-success via-crypto-glow to-crypto-glow opacity-50"></div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{userStats.level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
            <Star className="w-6 h-6 mx-auto mt-2 text-warning" />
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-crypto-glow">{userStats.points}</div>
            <div className="text-sm text-muted-foreground">Points</div>
            <Zap className="w-6 h-6 mx-auto mt-2 text-crypto-glow" />
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-crypto-neon-green">{userStats.badges}</div>
            <div className="text-sm text-muted-foreground">Badges</div>
            <Award className="w-6 h-6 mx-auto mt-2 text-crypto-neon-green" />
          </CardContent>
        </Card>

        <Card className="glow-border">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning">{completionPercentage.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Progress</div>
            <Target className="w-6 h-6 mx-auto mt-2 text-warning" />
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-crypto-glow" />
            Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>{userStats.coursesCompleted}/{userStats.totalCourses} Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="glow-border">
              🏁 Crypto Basics
            </Badge>
            <Badge variant="secondary" className="glow-border">
              🔐 Wallet Security
            </Badge>
            <Badge variant="secondary" className="glow-border">
              💱 Trading 101
            </Badge>
            <Badge variant="outline">
              🚀 DeFi Fundamentals
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glow-border hover:neon-glow transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center space-y-3">
            <Gamepad2 className="w-12 h-12 mx-auto text-crypto-neon-purple group-hover:animate-bounce" />
            <h3 className="font-semibold">Play & Learn</h3>
            <p className="text-sm text-muted-foreground">Interactive games and quizzes</p>
            <Button variant="outline" className="w-full glow-border" onClick={() => onNavigate('games')}>
              Start Game <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="glow-border hover:neon-glow transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center space-y-3">
            <TrendingUp className="w-12 h-12 mx-auto text-success group-hover:animate-pulse" />
            <h3 className="font-semibold">Sandbox Mode</h3>
            <p className="text-sm text-muted-foreground">Practice with test coins</p>
            <Button variant="outline" className="w-full glow-border" onClick={() => onNavigate('sandbox')}>
              Practice Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="glow-border hover:neon-glow transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6 text-center space-y-3">
            <Coins className="w-12 h-12 mx-auto text-warning group-hover:animate-spin" />
            <h3 className="font-semibold">Learn & Earn</h3>
            <p className="text-sm text-muted-foreground">Earn crypto rewards</p>
            <Button variant="outline" className="w-full glow-border" onClick={() => onNavigate('learn')}>
              Earn Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="text-warning" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "First Transaction", desc: "Completed your first simulated transaction", icon: "🏆", time: "2 hours ago" },
              { title: "Quiz Master", desc: "Scored 100% on Blockchain Basics quiz", icon: "🧠", time: "1 day ago" },
              { title: "Security Champion", desc: "Completed Wallet Security course", icon: "🛡️", time: "3 days ago" },
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 glow-border">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground">{achievement.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoDashboard;