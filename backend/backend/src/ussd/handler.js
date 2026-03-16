// handles all ussd logic
// src/ussd/handler.js
export default (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('END USSD coming soon');
};