const express = require('express');
const router = express.Router();

// Import the MySQL pool from the main app (or create a new one here)
const mysql = require('mysql2');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'complus_db'
});

// Route to get all records from the `formulae` table
router.get('/formulae', (req, res) => {
  const query = 'SELECT * FROM formulae';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from formulae table:', err.message);
      return res.status(500).json({ error: 'Failed to fetch formulae data.' });
    }
    res.json(results);
  });
});

// Route to get all records from the `monthly_summary` table
router.post('/monthly_summary', (req, res) => {
  var query = 'SELECT * FROM monthly_summary where formula_id > 0 ';
  const month = parseInt(req.body.month, 10);
  const year = parseInt(req.body.year, 10);
  const reportType = req.body.reportType;
  if(month){
    query += `and month = ${month} `
  }
  if(year){
    query += `and year = ${year} `
  }
  if(reportType !== ""){
    query += `and report_type = '${reportType}' `
  }
  console.log('query = ', query)

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from monthly_summary table:', err.message);
      return res.status(500).json({ error: 'Failed to fetch monthly_summary data.' });
    }
    res.json(results);
  });
});


router.post('/monthly_summary/top-level-parent', (req, res) => {
  console.log('Top Level Parent')
  const month = parseInt(req.body.month, 10);
  const year = parseInt(req.body.year, 10);
  const reportType = req.body.reportType;
  var query = 'SELECT * FROM monthly_summary where parent_id IS NULL and account_id = 0 ';
  // console.log(`Month = ${month} and Year = ${year} report_type = ${reportType}`)
  if(month){
    query += `and month = ${month} `
  }
  if(year){
    query += `and year = ${year} `
  }
  if(reportType !== ""){
    query += `and report_type = '${reportType}' `
  }
  console.log('query = ', query)
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from monthly_summary table:', err.message);
      return res.status(500).json({ error: 'Failed to fetch monthly_summary data.' });
    }
    res.json(results);
  });
});

router.post('/monthly-summary/selected-params', (req, res) => {
  const selectedTable = req.body.selectedTable
  var query = '';
  query = 'SELECT * FROM monthly_summary where formula_id > 0 '
  const month = parseInt(req.body.month, 10);
  const year = parseInt(req.body.year, 10);
  const reportType = req.body.reportType;
  const formulaId = req.body.formulaId;
  const name = req.body.name;
  console.log(`Month = ${month} and Year = ${year} report_type = ${reportType}`)

  if(formulaId){
    query += `and formula_id = '${formulaId}' `
  } 
 
    if(name){
      query += `and name like '%${name}%' `
    }

  if(reportType !== ""){
    query += `and report_type = '${reportType}' `
  }
    if(year){
    query += `and year = ${year} `
    }

    if(month){
      query += `and month = ${month} `
    }
  
  
  console.log('query = ', query)
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from monthly_summary table:', err.message);
      return res.status(500).json({ error: 'Failed to fetch monthly_summary data.' });
    }
    res.json(results);
  });
});

module.exports = router;
