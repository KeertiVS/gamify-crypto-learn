import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Puzzle, 
  Trophy, 
  RotateCcw, 
  Zap,
  CheckCircle,
  Timer
} from 'lucide-react';

interface Block {
  id: number;
  type: 'genesis' | 'transaction' | 'reward' | 'hash';
  content: string;
  placed: boolean;
  correctPosition: number;
}

const BlockPuzzleGame = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [placedBlocks, setPlacedBlocks] = useState<(Block | null)[]>([null, null, null, null]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const initialBlocks: Block[] = [
    { id: 1, type: 'genesis', content: 'Genesis Block', placed: false, correctPosition: 0 },
    { id: 2, type: 'transaction', content: 'Alice → Bob: 5 BTC', placed: false, correctPosition: 1 },
    { id: 3, type: 'hash', content: 'Hash: 00000a1b2c3d...', placed: false, correctPosition: 2 },
    { id: 4, type: 'reward', content: 'Mining Reward: 6.25 BTC', placed: false, correctPosition: 3 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setBlocks([...initialBlocks].sort(() => Math.random() - 0.5));
    setPlacedBlocks([null, null, null, null]);
    setScore(0);
    setTimeLeft(60);
    setGameActive(true);
    setGameComplete(false);
  };

  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    
    if (finalScore === 400) {
      toast({
        title: "Perfect Score! 🏆",
        description: "You've mastered blockchain structure!",
      });
    } else if (finalScore >= 200) {
      toast({
        title: "Great Job! ⭐",
        description: `Score: ${finalScore} points`,
      });
    }
  };

  const calculateScore = () => {
    let points = 0;
    placedBlocks.forEach((block, index) => {
      if (block && block.correctPosition === index) {
        points += 100;
      }
    });
    return points;
  };

  const handleBlockClick = (block: Block) => {
    if (!gameActive || block.placed) return;

    // Find first empty slot
    const emptySlotIndex = placedBlocks.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      const newPlacedBlocks = [...placedBlocks];
      newPlacedBlocks[emptySlotIndex] = block;
      setPlacedBlocks(newPlacedBlocks);

      const newBlocks = blocks.map(b => 
        b.id === block.id ? { ...b, placed: true } : b
      );
      setBlocks(newBlocks);

      // Check if game is complete
      if (newPlacedBlocks.every(slot => slot !== null)) {
        setTimeout(endGame, 500);
      }
    }
  };

  const removeBlock = (index: number) => {
    if (!gameActive) return;

    const removedBlock = placedBlocks[index];
    if (removedBlock) {
      const newPlacedBlocks = [...placedBlocks];
      newPlacedBlocks[index] = null;
      setPlacedBlocks(newPlacedBlocks);

      const newBlocks = blocks.map(b => 
        b.id === removedBlock.id ? { ...b, placed: false } : b
      );
      setBlocks(newBlocks);
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'genesis': return 'bg-primary/20 border-primary text-primary';
      case 'transaction': return 'bg-crypto-glow/20 border-crypto-glow text-crypto-glow';
      case 'hash': return 'bg-crypto-neon-green/20 border-crypto-neon-green text-crypto-neon-green';
      case 'reward': return 'bg-warning/20 border-warning text-warning';
      default: return 'bg-muted border-muted-foreground text-muted-foreground';
    }
  };

  const isCorrectlyPlaced = (block: Block | null, index: number) => {
    return block && block.correctPosition === index;
  };

  if (!gameActive && !gameComplete) {
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="text-crypto-neon-green" />
            Block Puzzle Game
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl mb-4">🧩</div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Build the Blockchain</h3>
            <p className="text-muted-foreground">
              Arrange the blocks in the correct order to build a valid blockchain
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
              <div className="font-medium text-primary">Genesis Block</div>
              <div className="text-muted-foreground">First block in chain</div>
            </div>
            <div className="p-3 bg-crypto-glow/10 rounded-lg border border-crypto-glow/30">
              <div className="font-medium text-crypto-glow">Transaction</div>
              <div className="text-muted-foreground">Transfer of value</div>
            </div>
            <div className="p-3 bg-crypto-neon-green/10 rounded-lg border border-crypto-neon-green/30">
              <div className="font-medium text-crypto-neon-green">Hash</div>
              <div className="text-muted-foreground">Block fingerprint</div>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
              <div className="font-medium text-warning">Mining Reward</div>
              <div className="text-muted-foreground">Miner compensation</div>
            </div>
          </div>
          <Button onClick={startGame} className="w-full glow-border">
            <Zap className="w-4 h-4 mr-2" />
            Start Puzzle
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameComplete) {
    const percentage = (score / 400) * 100;
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="text-warning" />
            Puzzle Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl mb-4">
            {percentage >= 100 ? '🏆' : percentage >= 75 ? '🥇' : percentage >= 50 ? '🥈' : '🥉'}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">{score} Points</div>
            <div className="text-lg">
              {score}/400 ({percentage.toFixed(0)}%)
            </div>
          </div>
          <div className="space-y-2">
            {percentage >= 100 && (
              <Badge className="bg-warning text-warning-foreground">
                🏆 Blockchain Master!
              </Badge>
            )}
            {percentage >= 75 && (
              <Badge className="bg-success text-success-foreground">
                ⭐ Block Builder Badge Earned!
              </Badge>
            )}
          </div>
          <Button onClick={startGame} className="w-full glow-border">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glow-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="text-crypto-neon-green" />
            Block Puzzle
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className={`font-mono ${timeLeft <= 10 ? 'text-destructive' : 'text-crypto-glow'}`}>
                {timeLeft}s
              </span>
            </div>
            <Badge variant="secondary">Score: {calculateScore()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Blockchain Slots */}
        <div className="space-y-2">
          <h3 className="font-semibold">Blockchain Structure:</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {placedBlocks.map((block, index) => (
              <div
                key={index}
                className={`h-20 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  block 
                    ? isCorrectlyPlaced(block, index)
                      ? 'border-success bg-success/10' 
                      : 'border-destructive bg-destructive/10'
                    : 'border-muted-foreground hover:border-crypto-glow'
                }`}
                onClick={() => removeBlock(index)}
              >
                {block ? (
                  <div className="text-center p-2">
                    <div className="text-sm font-medium">{block.content}</div>
                    {isCorrectlyPlaced(block, index) && (
                      <CheckCircle className="w-4 h-4 mx-auto mt-1 text-success" />
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Slot {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Available Blocks */}
        <div className="space-y-2">
          <h3 className="font-semibold">Available Blocks:</h3>
          <div className="grid grid-cols-2 gap-2">
            {blocks.filter(block => !block.placed).map((block) => (
              <div
                key={block.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${getBlockColor(block.type)}`}
                onClick={() => handleBlockClick(block)}
              >
                <div className="text-center">
                  <div className="font-medium text-sm">{block.content}</div>
                  <div className="text-xs opacity-70 capitalize">{block.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Drag blocks to build the blockchain in the correct order!
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockPuzzleGame;