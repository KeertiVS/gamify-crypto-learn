import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  Trophy, 
  RotateCcw, 
  Lightbulb,
  CheckCircle,
  Timer,
  Zap
} from 'lucide-react';

const CRYPTO_SYMBOLS = ['₿', '♦', '♠', '♣', '◆', '◇', '♥', '♤', '◈'];

interface Cell {
  value: string;
  isFixed: boolean;
  isValid: boolean;
}

const CryptoSudoku = () => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Generate a simple 4x4 crypto sudoku puzzle
  const generatePuzzle = (): Cell[][] => {
    const solution = [
      ['₿', '♦', '♠', '♣'],
      ['♠', '♣', '₿', '♦'],
      ['♦', '₿', '♣', '♠'],
      ['♣', '♠', '♦', '₿']
    ];

    const puzzle: Cell[][] = solution.map(row => 
      row.map(value => ({
        value,
        isFixed: false,
        isValid: true
      }))
    );

    // Remove some cells to create the puzzle
    const cellsToRemove = [
      [0, 1], [0, 3], [1, 0], [1, 2], 
      [2, 1], [2, 3], [3, 0], [3, 2]
    ];

    cellsToRemove.forEach(([row, col]) => {
      puzzle[row][col].value = '';
    });

    // Set fixed cells
    puzzle.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.value !== '') {
          cell.isFixed = true;
        }
      });
    });

    return puzzle;
  };

  const startGame = () => {
    setGrid(generatePuzzle());
    setGameActive(true);
    setGameComplete(false);
    setSelectedCell(null);
    setMistakes(0);
    setTimeElapsed(0);
    setHintsUsed(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && !gameComplete) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameComplete]);

  const isValidMove = (grid: Cell[][], row: number, col: number, value: string): boolean => {
    // Check row
    for (let c = 0; c < 4; c++) {
      if (c !== col && grid[row][c].value === value) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < 4; r++) {
      if (r !== row && grid[r][col].value === value) {
        return false;
      }
    }

    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    for (let r = boxRow; r < boxRow + 2; r++) {
      for (let c = boxCol; c < boxCol + 2; c++) {
        if ((r !== row || c !== col) && grid[r][c].value === value) {
          return false;
        }
      }
    }

    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameActive || grid[row][col].isFixed) return;
    setSelectedCell({ row, col });
  };

  const handleSymbolClick = (symbol: string) => {
    if (!selectedCell || !gameActive) return;

    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;

    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    
    if (isValidMove(newGrid, row, col, symbol)) {
      newGrid[row][col].value = symbol;
      newGrid[row][col].isValid = true;
    } else {
      newGrid[row][col].value = symbol;
      newGrid[row][col].isValid = false;
      setMistakes(prev => prev + 1);
      
      toast({
        title: "Invalid move!",
        description: "This symbol conflicts with sudoku rules",
        variant: "destructive",
      });
    }

    setGrid(newGrid);

    // Check if puzzle is complete
    const isComplete = newGrid.every(row => 
      row.every(cell => cell.value !== '' && cell.isValid)
    );

    if (isComplete) {
      setGameComplete(true);
      setGameActive(false);
      const score = calculateScore();
      
      toast({
        title: "Puzzle Complete! 🎉",
        description: `Score: ${score} points`,
      });
    }
  };

  const clearCell = () => {
    if (!selectedCell || !gameActive) return;

    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;

    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    newGrid[row][col].value = '';
    newGrid[row][col].isValid = true;
    setGrid(newGrid);
  };

  const useHint = () => {
    if (!gameActive || hintsUsed >= 3) return;

    // Find an empty cell and fill it with correct value
    const solution = [
      ['₿', '♦', '♠', '♣'],
      ['♠', '♣', '₿', '♦'],
      ['♦', '₿', '♣', '♠'],
      ['♣', '♠', '♦', '₿']
    ];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col].value === '') {
          const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
          newGrid[row][col].value = solution[row][col];
          newGrid[row][col].isValid = true;
          setGrid(newGrid);
          setHintsUsed(prev => prev + 1);
          
          toast({
            title: "Hint used!",
            description: `${3 - hintsUsed - 1} hints remaining`,
          });
          return;
        }
      }
    }
  };

  const calculateScore = () => {
    const baseScore = 1000;
    const timeBonus = Math.max(0, 300 - timeElapsed);
    const mistakePenalty = mistakes * 50;
    const hintPenalty = hintsUsed * 100;
    
    return Math.max(100, baseScore + timeBonus - mistakePenalty - hintPenalty);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameActive && !gameComplete) {
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="text-warning" />
            Crypto Sudoku
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="text-6xl mb-4">🔢</div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Crypto Symbol Sudoku</h3>
            <p className="text-muted-foreground">
              Fill the 4x4 grid so each row, column, and 2x2 box contains all crypto symbols
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 w-fit mx-auto">
            {CRYPTO_SYMBOLS.slice(0, 4).map((symbol, index) => (
              <div key={index} className="w-8 h-8 flex items-center justify-center bg-secondary rounded border">
                <span className="text-lg">{symbol}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Each symbol appears once in each row</div>
            <div>• Each symbol appears once in each column</div>
            <div>• Each symbol appears once in each 2x2 box</div>
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
    const score = calculateScore();
    return (
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Trophy className="text-warning" />
            Sudoku Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl mb-4">
            {mistakes === 0 ? '🏆' : mistakes <= 2 ? '🥇' : mistakes <= 5 ? '🥈' : '🥉'}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">{score} Points</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium">Time</div>
                <div className="text-muted-foreground">{formatTime(timeElapsed)}</div>
              </div>
              <div>
                <div className="font-medium">Mistakes</div>
                <div className="text-muted-foreground">{mistakes}</div>
              </div>
              <div>
                <div className="font-medium">Hints</div>
                <div className="text-muted-foreground">{hintsUsed}/3</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {mistakes === 0 && (
              <Badge className="bg-warning text-warning-foreground">
                🏆 Perfect Game!
              </Badge>
            )}
            {score >= 800 && (
              <Badge className="bg-success text-success-foreground">
                ⭐ Sudoku Master Badge Earned!
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
            <Star className="text-warning" />
            Crypto Sudoku
          </CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Timer className="w-4 h-4" />
              {formatTime(timeElapsed)}
            </div>
            <Badge variant="outline">Mistakes: {mistakes}</Badge>
            <Badge variant="outline">Hints: {hintsUsed}/3</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sudoku Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-1 p-2 bg-muted rounded-lg">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${
                    cell.isFixed
                      ? 'bg-secondary border-border text-foreground'
                      : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? 'bg-crypto-glow/20 border-crypto-glow'
                      : cell.value && !cell.isValid
                      ? 'bg-destructive/20 border-destructive text-destructive'
                      : 'bg-background border-border hover:bg-secondary'
                  } ${
                    (rowIndex === 1 || colIndex === 1) ? 'border-r-4' : ''
                  } ${
                    (rowIndex === 1 || colIndex === 1) ? 'border-b-4' : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.value}
                  {cell.isFixed && (
                    <div className="absolute w-2 h-2 bg-primary rounded-full top-1 right-1" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Symbol Selector */}
        <div className="space-y-2">
          <h3 className="font-semibold text-center">Select Symbol:</h3>
          <div className="flex justify-center gap-2">
            {CRYPTO_SYMBOLS.slice(0, 4).map((symbol) => (
              <Button
                key={symbol}
                variant="outline"
                size="sm"
                className="w-12 h-12 text-lg glow-border hover:neon-glow"
                onClick={() => handleSymbolClick(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearCell}
            disabled={!selectedCell}
            className="glow-border"
          >
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={useHint}
            disabled={hintsUsed >= 3}
            className="glow-border"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Hint ({3 - hintsUsed})
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Select a cell, then choose a symbol to place
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoSudoku;