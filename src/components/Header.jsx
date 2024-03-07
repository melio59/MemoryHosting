import React from 'react';

export function Header({ score, timer, onLevelChange, onRestart }) {
  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    onLevelChange(selectedLevel);
  };

  const handleRestart = () => {
    onRestart();
  };

  return (
    <div className="header">
      <p>
        Score: {score} | Chronomètre: {timer} secondes
      </p>
      <div>
        <label htmlFor="difficulty">Niveau de difficulté :</label>
        <select id="difficulty" onChange={handleLevelChange}>
          <option value="easy">Facile</option>
          <option value="medium">Moyen</option>
          <option value="hard">Difficile</option>
        </select>
      </div>
      <button className="restart-button" onClick={handleRestart}>
  Recommencer
</button>
    </div>
  );
}
