import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  Send, 
  Wallet, 
  QrCode, 
  Copy, 
  Check,
  AlertTriangle,
  Info,
  TrendingUp,
  History,
  Play,
  RotateCcw
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  address: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  fee: number;
}

const SandboxMode = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(1000); // Test tokens
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAddress] = useState('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'); // Example address
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const transactionSteps = [
    { title: 'Enter Amount', description: 'Specify how much to send' },
    { title: 'Add Recipient', description: 'Enter destination address' },
    { title: 'Review Details', description: 'Confirm transaction details' },
    { title: 'Sign Transaction', description: 'Authorize with your wallet' },
    { title: 'Broadcast', description: 'Send to network' },
    { title: 'Confirm', description: 'Wait for confirmation' }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const sendTransaction = async () => {
    if (!sendAmount || !recipientAddress) {
      toast({
        title: "Missing information",
        description: "Please enter amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (amount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough test tokens",
        variant: "destructive",
      });
      return;
    }

    setIsTransactionInProgress(true);
    setCurrentStep(0);

    // Simulate transaction steps
    for (let step = 0; step < transactionSteps.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(step + 1);
    }

    // Create transaction
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'send',
      amount: amount,
      address: recipientAddress,
      status: 'confirmed',
      timestamp: new Date(),
      fee: 0.001
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev - amount - 0.001);
    setSendAmount('');
    setRecipientAddress('');
    setIsTransactionInProgress(false);
    setCurrentStep(0);

    toast({
      title: "Transaction successful!",
      description: `Sent ${amount} test tokens`,
    });
  };

  const receiveTokens = () => {
    const amount = Math.random() * 10 + 1; // Random amount between 1-11
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'receive',
      amount: amount,
      address: 'faucet_address',
      status: 'confirmed',
      timestamp: new Date(),
      fee: 0
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);

    toast({
      title: "Tokens received!",
      description: `Received ${amount.toFixed(3)} test tokens from faucet`,
    });
  };

  const resetSandbox = () => {
    setBalance(1000);
    setTransactions([]);
    setSendAmount('');
    setRecipientAddress('');
    setCurrentStep(0);
    setIsTransactionInProgress(false);
    
    toast({
      title: "Sandbox reset",
      description: "All data has been reset to initial state",
    });
  };

  const startTutorial = () => {
    setShowTutorial(true);
    // Add tutorial logic here
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold crypto-gradient bg-clip-text text-transparent">
          Sandbox Mode
        </h2>
        <p className="text-muted-foreground text-lg">
          Practice crypto transactions in a risk-free environment
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={startTutorial} variant="outline" className="glow-border">
            <Play className="w-4 h-4 mr-2" />
            Start Tutorial
          </Button>
          <Button onClick={resetSandbox} variant="outline" className="glow-border">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Sandbox
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="text-crypto-glow" />
            Test Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-lg glow-border">
              <Coins className="w-8 h-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold text-warning">
                {balance.toFixed(3)} TST
              </div>
              <div className="text-sm text-muted-foreground">Test Tokens</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-lg glow-border">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-crypto-neon-green" />
              <div className="text-2xl font-bold text-crypto-neon-green">
                ${(balance * 1.23).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">USD Value</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Wallet Address:</div>
            <div className="flex items-center gap-2 p-2 bg-muted rounded border">
              <code className="flex-1 text-sm font-mono">{walletAddress}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(walletAddress)}
                className="hover:glow-border"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" className="hover:glow-border">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Button onClick={receiveTokens} className="w-full glow-border">
            <Coins className="w-4 h-4 mr-2" />
            Get Test Tokens (Faucet)
          </Button>
        </CardContent>
      </Card>

      {/* Send Transaction */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="text-crypto-glow" />
            Send Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTransactionInProgress && (
            <Card className="bg-crypto-glow/10 border-crypto-glow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-crypto-glow" />
                    <span className="font-medium">Processing Transaction</span>
                  </div>
                  <div className="space-y-2">
                    {transactionSteps.map((step, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 text-sm ${
                          index < currentStep 
                            ? 'text-success' 
                            : index === currentStep 
                            ? 'text-crypto-glow' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {index < currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : index === currentStep ? (
                          <div className="w-4 h-4 border-2 border-crypto-glow border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 border border-muted-foreground rounded-full" />
                        )}
                        <span>{step.title}: {step.description}</span>
                      </div>
                    ))}
                  </div>
                  <Progress value={(currentStep / transactionSteps.length) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (TST)</label>
              <Input
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                disabled={isTransactionInProgress}
                className="glow-border"
              />
              <div className="text-xs text-muted-foreground">
                Available: {balance.toFixed(3)} TST
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Address</label>
              <Input
                placeholder="Enter wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={isTransactionInProgress}
                className="glow-border"
              />
            </div>

            <div className="p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Sandbox Environment</div>
                  <div className="text-muted-foreground">
                    This is a test environment. No real cryptocurrency will be sent.
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={sendTransaction} 
              disabled={isTransactionInProgress}
              className="w-full glow-border"
            >
              {isTransactionInProgress ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Transaction
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="glow-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="text-crypto-glow" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet. Try sending or receiving some test tokens!
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 glow-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'send' 
                        ? 'bg-destructive/20 text-destructive' 
                        : 'bg-success/20 text-success'
                    }`}>
                      {tx.type === 'send' ? (
                        <Send className="w-4 h-4" />
                      ) : (
                        <Coins className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount.toFixed(3)} TST
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tx.type === 'send' ? 'To:' : 'From:'} {tx.address.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={tx.status === 'confirmed' ? 'secondary' : 'outline'}
                      className="glow-border"
                    >
                      {tx.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SandboxMode;