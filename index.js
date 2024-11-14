const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const port = 3000;

// publicディレクトリにある静的ファイル（HTML、CSS、JS、CSVなど）を提供
app.use(express.static(path.join(__dirname, 'public')));

let players = [];

// players.csv のデータを読み込む
fs.createReadStream(path.join(__dirname, 'public', 'players.csv'))
  .pipe(csv())
  .on('data', (data) => {
    players.push({
      game: data.Game.trim(),
      team: data.Team.trim(),
      name: data.Name.trim(),
      sensitivity: parseFloat(data.Sensitivity.trim())
    });
  })
  .on('end', () => {
    console.log('選手データの読み込みが完了しました');
  });

// エイム感度診断ページの表示（index.html）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// エイム感度診断の計算結果を提供するAPI
app.get('/players.csv', (req, res) => {
  res.json(players);
});

// サーバーの起動
app.listen(port, () => {
  console.log(`サーバーは http://localhost:${port} で動作しています`);
});
