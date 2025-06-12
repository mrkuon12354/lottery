import React, { useState, useEffect } from 'react';
import { useLotteryContext } from '../context/context';
import styles from '../styles/LotteryHistory.module.css';

export interface LotteryRound {
  roundId: number;
  timestamp: Date;
  potSize: string;
  winner: string;
}

const LotteryHistory: React.FC = () => {
  const { lotteryContract } = useLotteryContext();
  const [history, setHistory] = useState<LotteryRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotteryHistory = async () => {
      try {
        if (!lotteryContract) {
          throw new Error('Lottery contract not initialized');
        }

        // This is a placeholder - replace with actual contract method
        const pastRounds = await lotteryContract.getPastRounds();
        
        setHistory(pastRounds);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching lottery history:', err);
        setError('Failed to load lottery history');
        setLoading(false);
      }
    };

    fetchLotteryHistory();
  }, [lotteryContract]);

  if (loading) return <div>Loading history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.historyContainer}>
      <h2>Lottery History</h2>
      {history.length === 0 ? (
        <p>No past lottery rounds yet.</p>
      ) : (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Round</th>
              <th>Date</th>
              <th>Pot Size</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {history.map((round) => (
              <tr key={round.roundId}>
                <td>{round.roundId}</td>
                <td>{round.timestamp.toLocaleDateString()}</td>
                <td>{round.potSize} ETH</td>
                <td>{round.winner.slice(0, 6)}...{round.winner.slice(-4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LotteryHistory;