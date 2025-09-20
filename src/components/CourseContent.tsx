import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Clock, 
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Coins
} from 'lucide-react';

interface Module {
  id: number;
  title: string;
  content: string;
  videoLength: string;
  completed: boolean;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

interface CourseContentProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onComplete: (courseId: string, reward: number) => void;
}

const CourseContent = ({ courseId, courseTitle, onBack, onComplete }: CourseContentProps) => {
  const { toast } = useToast();
  const [currentModule, setCurrentModule] = useState(0);
  const [modules, setModules] = useState<Module[]>(getCourseModules(courseId));
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);

  const currentModuleData = modules[currentModule];
  const completedModules = modules.filter(m => m.completed).length;
  const progress = (completedModules / modules.length) * 100;

  const completeModule = () => {
    const newModules = [...modules];
    newModules[currentModule].completed = true;
    setModules(newModules);
    
    // Check if course is complete
    if (newModules.every(m => m.completed)) {
      const reward = getCourseReward(courseId);
      onComplete(courseId, reward);
      toast({
        title: "Course Complete! 🎉",
        description: `Earned ${reward} points!`,
      });
    } else {
      toast({
        title: "Module Complete!",
        description: "Great progress! Continue to the next module.",
      });
    }
  };

  const nextModule = () => {
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    }
  };

  const previousModule = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setQuizAnswer(null);
      setShowQuizResult(false);
    }
  };

  const submitQuiz = () => {
    if (quizAnswer === null || !currentModuleData.quiz) return;
    
    setShowQuizResult(true);
    if (quizAnswer === currentModuleData.quiz.correct) {
      completeModule();
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Review the content and try again!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="glow-border">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{courseTitle}</h2>
          <p className="text-muted-foreground">
            Module {currentModule + 1} of {modules.length}
          </p>
        </div>
        <Badge variant="secondary" className="glow-border">
          {completedModules}/{modules.length} Complete
        </Badge>
      </div>

      {/* Progress */}
      <Card className="glow-border">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Course Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Module Navigation */}
      <Card className="glow-border">
        <CardContent className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {modules.map((module, index) => (
              <Button
                key={module.id}
                variant={index === currentModule ? "default" : "outline"}
                size="sm"
                className={`min-w-fit ${
                  module.completed ? 'border-success' : 
                  index === currentModule ? 'glow-border' : 
                  'hover:glow-border'
                }`}
                onClick={() => setCurrentModule(index)}
              >
                {module.completed ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : index === currentModule ? (
                  <Play className="w-4 h-4 mr-1" />
                ) : (
                  <Lock className="w-4 h-4 mr-1" />
                )}
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module Content */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="text-crypto-glow" />
            {currentModuleData.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {currentModuleData.videoLength}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Placeholder */}
          <div className="aspect-video bg-secondary/50 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 mx-auto mb-4 text-crypto-glow" />
              <div className="font-semibold">Video Content</div>
              <div className="text-sm text-muted-foreground">
                {currentModuleData.videoLength} video lesson
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground whitespace-pre-line">
              {currentModuleData.content}
            </div>
          </div>

          {/* Quiz */}
          {currentModuleData.quiz && (
            <Card className="bg-crypto-glow/10 border-crypto-glow">
              <CardHeader>
                <CardTitle className="text-lg">Quick Quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{currentModuleData.quiz.question}</p>
                
                <div className="space-y-2">
                  {currentModuleData.quiz.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={quizAnswer === index ? "default" : "outline"}
                      className={`w-full text-left justify-start ${
                        showQuizResult
                          ? index === currentModuleData.quiz!.correct
                            ? 'border-success bg-success/20'
                            : index === quizAnswer && index !== currentModuleData.quiz!.correct
                            ? 'border-destructive bg-destructive/20'
                            : ''
                          : 'glow-border hover:neon-glow'
                      }`}
                      onClick={() => !showQuizResult && setQuizAnswer(index)}
                      disabled={showQuizResult}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                      {showQuizResult && index === currentModuleData.quiz!.correct && (
                        <CheckCircle className="w-4 h-4 ml-auto text-success" />
                      )}
                    </Button>
                  ))}
                </div>

                {!showQuizResult && (
                  <Button 
                    onClick={submitQuiz} 
                    disabled={quizAnswer === null}
                    className="w-full glow-border"
                  >
                    Submit Answer
                  </Button>
                )}

                {showQuizResult && (
                  <div className="text-center">
                    {quizAnswer === currentModuleData.quiz.correct ? (
                      <div className="text-success">
                        ✅ Correct! Module completed.
                      </div>
                    ) : (
                      <div className="text-destructive">
                        ❌ Incorrect. Review the content and try again.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Module Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={previousModule}
              disabled={currentModule === 0}
              className="glow-border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!currentModuleData.quiz && !currentModuleData.completed && (
                <Button onClick={completeModule} className="glow-border">
                  Complete Module
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
              
              {currentModule < modules.length - 1 && (
                <Button
                  onClick={nextModule}
                  disabled={!currentModuleData.completed}
                  className="glow-border"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const getCourseModules = (courseId: string): Module[] => {
  const moduleDatabase: Record<string, Module[]> = {
    'crypto-basics': [
      {
        id: 1,
        title: 'What is Cryptocurrency?',
        content: 'Cryptocurrency is a digital or virtual form of currency that uses cryptography for security. Unlike traditional currencies issued by governments (fiat currencies), cryptocurrencies operate on decentralized networks based on blockchain technology.\n\nKey characteristics:\n• Decentralized: No single authority controls it\n• Secure: Uses cryptographic techniques\n• Transparent: All transactions are recorded on a public ledger\n• Immutable: Transaction history cannot be changed',
        videoLength: '8 min',
        completed: false,
        quiz: {
          question: 'What makes cryptocurrency different from traditional money?',
          options: [
            'It is controlled by banks',
            'It uses cryptography and is decentralized',
            'It only exists in physical form',
            'It cannot be traded'
          ],
          correct: 1
        }
      },
      {
        id: 2,
        title: 'Blockchain Technology',
        content: 'Blockchain is the underlying technology that powers cryptocurrencies. Think of it as a digital ledger that records transactions across multiple computers in a way that makes it extremely difficult to change, hack, or cheat.\n\nHow it works:\n• Blocks contain transaction data\n• Each block is linked to the previous one\n• The chain is distributed across many computers\n• Consensus mechanisms validate new blocks',
        videoLength: '12 min',
        completed: false,
        quiz: {
          question: 'What is a blockchain?',
          options: [
            'A type of cryptocurrency',
            'A distributed ledger technology',
            'A wallet application',
            'A mining machine'
          ],
          correct: 1
        }
      }
    ],
    'wallet-security': [
      {
        id: 1,
        title: 'Types of Crypto Wallets',
        content: 'Crypto wallets are tools that store your private keys and allow you to interact with the blockchain. There are several types:\n\nHot Wallets (Online):\n• Software wallets on your phone/computer\n• Web wallets in browsers\n• Exchange wallets\n\nCold Wallets (Offline):\n• Hardware wallets (USB devices)\n• Paper wallets\n• Air-gapped computers\n\nSecurity increases as you move from hot to cold storage.',
        videoLength: '10 min',
        completed: false
      }
    ]
  };

  return moduleDatabase[courseId] || [];
};

const getCourseReward = (courseId: string): number => {
  const rewards: Record<string, number> = {
    'crypto-basics': 50,
    'wallet-security': 40,
    'trading-basics': 75,
    'defi-fundamentals': 100,
    'nft-creation': 80,
    'advanced-trading': 150
  };
  
  return rewards[courseId] || 50;
};

export default CourseContent;