import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Puzzle, 
  Brain, 
  Trophy, 
  Timer, 
  Star,
  RotateCcw,
  Check,
  X
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is a blockchain?",
    options: [
      "A type of cryptocurrency",
      "A distributed ledger technology", 
      "A wallet application",
      "A trading platform"
    ],
    correct: 1,
    explanation: "A blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks."
  },
  {
    id: 2,
    question: "What does 'HODL' mean in crypto?",
    options: [
      "Hold On for Dear Life",
      "High Order Digital Ledger",
      "Hash Output Distribution Logic",
      "Hardware Operational Data Layer"
    ],
    correct: 0,
    explanation: "HODL originated from a misspelled 'hold' and now means 'Hold On for Dear Life' - a strategy of holding crypto long-term."
  },
  {
    id: 3,
    question: "Which consensus mechanism does Bitcoin use?",
    options: [
      "Proof of Stake",
      "Proof of Work",
      "Delegated Proof of Stake",
      "Proof of Authority"
    ],
    correct: 1,
    explanation: "Bitcoin uses Proof of Work (PoW), where miners compete to solve complex mathematical puzzles to validate transactions."
  }
];

const GameModule = () => {
  const [currentGame, setCurrentGame] = useState<'quiz' | 'puzzle' | 'sudoku'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isActive, setIsActive] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0 && !showExplanation) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining => timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleAnswer(-1); // Auto-submit when time runs out
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, showExplanation]);

  const startQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameComplete(false);
    setTimeRemaining(30);
    setIsActive(true);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setIsActive(false);
    
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setScore(score + 10);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeRemaining(30);
      setIsActive(true);
    } else {
      setGameComplete(true);
      setIsActive(false);
    }
  };

  const resetGame = () => {
    setCurrentGame('quiz');
    startQuiz();
  };

  const GameSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          currentGame === 'quiz' ? 'glow-border neon-glow' : 'border-border hover:glow-border'
        }`}
        onClick={() => setCurrentGame('quiz')}
      >
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-3 text-crypto-glow" />
          <h3 className="font-semibold">Crypto Quiz</h3>
          <p className="text-sm text-muted-foreground">Test your knowledge</p>
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          currentGame === 'puzzle' ? 'glow-border neon-glow' : 'border-border hover:glow-border'
        }`}
        onClick={() => setCurrentGame('puzzle')}
      >
        <CardContent className="p-6 text-center">
          <Puzzle className="w-12 h-12 mx-auto mb-3 text-crypto-neon-green" />
          <h3 className="font-semibold">Block Puzzle</h3>
          <p className="text-sm text-muted-foreground">Build the blockchain</p>
        </CardContent>
      </Card>

      <Card 
        className={`cursor-pointer transition-all duration-300 ${
          currentGame === 'sudoku' ? 'glow-border neon-glow' : 'border-border hover:glow-border'
        }`}
        onClick={() => setCurrentGame('sudoku')}
      >
        <CardContent className="p-6 text-center">
          <Star className="w-12 h-12 mx-auto mb-3 text-warning" />
          <h3 className="font-semibold">Crypto Sudoku</h3>
          <p className="text-sm text-muted-foreground">Logic challenge</p>
        </CardContent>
      </Card>
    </div>
  );

  const QuizGame = () => {
    if (!isActive && currentQuestion === 0 && !gameComplete) {
      return (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="text-center">Crypto Knowledge Quiz</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-muted-foreground">
              Test your crypto knowledge and earn points!
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary">10 points per correct answer</Badge>
              <Badge variant="secondary">30 seconds per question</Badge>
            </div>
            <Button onClick={startQuiz} className="w-full glow-border">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (gameComplete) {
      const percentage = (score / (quizQuestions.length * 10)) * 100;
      return (
        <Card className="glow-border">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Trophy className="text-warning" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl mb-4">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'}
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{score} Points</div>
              <div className="text-lg">
                {score}/{quizQuestions.length * 10} ({percentage.toFixed(0)}%)
              </div>
            </div>
            <div className="space-y-2">
              {percentage >= 80 && (
                <Badge className="bg-warning text-warning-foreground">
                  🏆 Crypto Expert Badge Earned!
                </Badge>
              )}
              {percentage >= 60 && (
                <Badge className="bg-success text-success-foreground">
                  ⭐ Knowledge Seeker Badge Earned!
                </Badge>
              )}
            </div>
            <Button onClick={resetGame} className="w-full glow-border">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </CardContent>
        </Card>
      );
    }

    const question = quizQuestions[currentQuestion];
    
    return (
      <Card className="glow-border">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Question {currentQuestion + 1}/{quizQuestions.length}</CardTitle>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className={`font-mono ${timeRemaining <= 10 ? 'text-destructive' : 'text-crypto-glow'}`}>
                {timeRemaining}s
              </span>
            </div>
          </div>
          <Progress value={((currentQuestion) / quizQuestions.length) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">{question.question}</h3>
          
          {!showExplanation ? (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start glow-border hover:neon-glow"
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      index === question.correct
                        ? 'border-success bg-success/20'
                        : index === selectedAnswer && index !== question.correct
                        ? 'border-destructive bg-destructive/20'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{String.fromCharCode(65 + index)}. {option}</span>
                      {index === question.correct && <Check className="w-5 h-5 text-success" />}
                      {index === selectedAnswer && index !== question.correct && (
                        <X className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Explanation:</h4>
                <p className="text-sm">{question.explanation}</p>
              </div>
              
              <Button onClick={nextQuestion} className="w-full glow-border">
                {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <Badge variant="secondary">Current Score: {score} points</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold crypto-gradient bg-clip-text text-transparent">
          Learning Games
        </h2>
        <p className="text-muted-foreground">
          Learn crypto concepts through interactive games and challenges
        </p>
      </div>

      <GameSelector />

      {currentGame === 'quiz' && <QuizGame />}
      
      {currentGame === 'puzzle' && (
        <Card className="glow-border">
          <CardContent className="p-12 text-center">
            <Puzzle className="w-16 h-16 mx-auto mb-4 text-crypto-neon-green animate-pulse" />
            <h3 className="text-xl font-semibold mb-2">Block Puzzle Game</h3>
            <p className="text-muted-foreground mb-4">
              Build blockchain networks by connecting blocks in the correct sequence.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardContent>
        </Card>
      )}
      
      {currentGame === 'sudoku' && (
        <Card className="glow-border">
          <CardContent className="p-12 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-warning animate-spin" />
            <h3 className="text-xl font-semibold mb-2">Crypto Sudoku</h3>
            <p className="text-muted-foreground mb-4">
              Solve sudoku puzzles with crypto symbols and earn rewards.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GameModule;