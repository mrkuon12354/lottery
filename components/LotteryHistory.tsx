import React, { useState, useEffect } from 'react';
import { useLotteryContext } from '../context/context';
import styles from '../styles/LotteryHistory.module.css';

interface LotteryRound {
  roundId: number;
  timestamp: Date;
  winner: string;
  potSize: string;
}

const LotteryHistory: React.FC = () => {
  const [history, setHistory] = useState<LotteryRound[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { lotteryContract } = useLotteryContext();

  useEffect(() => {
    const fetchLotteryHistory = async () => {
      try {
        if (!lotteryContract) {
          throw new Error('Lottery contract not initialized');
        }

        // Simulated fetch - replace with actual contract method
        const rounds: LotteryRound[] = await lotteryContract.getPastRounds();
        setHistory(rounds);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchLotteryHistory();
  }, [lotteryContract]);

  if (loading) return <div>Loading lottery history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.historyContainer}>
      <h2>Lottery History</h2>
      {history.length === 0 ? (
        <p>No past lottery rounds found.</p>
      ) : (
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Round</th>
              <th>Date</th>
              <th>Winner</th>
              <th>Pot Size</th>
            </tr>
          </thead>
          <tbody>
            {history.map((round) => (
              <tr key={round.roundId}>
                <td>{round.roundId}</td>
                <td>{round.timestamp.toLocaleDateString()}</td>
                <td>{round.winner}</td>
                <td>{round.potSize} ETH</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LotteryHistory;